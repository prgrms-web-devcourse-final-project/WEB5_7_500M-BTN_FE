import { useEffect, useRef, useState, useCallback } from "react";
import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  WebSocketMessage,
  WebSocketStatus,
  SendMessagePayload,
} from "@/types/chat";
import { getAccessToken, refreshAccessToken } from "@/api/client";
import { logger } from "@/utils/logger";

interface UseWebSocketOptions {
  partyId: number;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: any) => void;
  onKick?: () => void;
}

export const useWebSocket = ({
  partyId,
  onMessage,
  onError,
  onKick,
}: UseWebSocketOptions) => {
  const [status, setStatus] = useState<WebSocketStatus>("DISCONNECTED");
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const clientRef = useRef<Client | null>(null);
  const partySubscriptionRef = useRef<StompSubscription | null>(null);
  const userSubscriptionRef = useRef<StompSubscription | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 3;

  // 콜백 함수들을 useRef로 안정화
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const onKickRef = useRef(onKick);

  // 콜백 함수들 업데이트
  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
    onKickRef.current = onKick;
  }, [onMessage, onError, onKick]);

  // 웹소켓 연결
  const connect = useCallback(async () => {
    try {
      setStatus("CONNECTING");

      const accessToken = getAccessToken();
      if (!accessToken) {
        logger.error("액세스 토큰이 없습니다.");
        setStatus("ERROR");
        return;
      }

      logger.debug("웹소켓 연결 시도", {
        partyId,
        token: accessToken.substring(0, 20) + "...",
      });

      // SockJS를 사용한 웹소켓 연결 - 토큰을 쿼리 파라미터와 헤더 모두에 전달
      const socket = new SockJS(
        `https://matjalalzz.shop/ws?token=${encodeURIComponent(accessToken)}`
      );

      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        debug: (str) => {
          if (process.env.NODE_ENV === "development") {
            logger.debug("WebSocket Debug:", str);
          }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        // 연결 시 쿼리 파라미터 로깅 추가
        beforeConnect: () => {
          logger.debug("STOMP 연결 전 쿼리 파라미터 확인", {
            url: `https://matjalalzz.shop/ws?token=${accessToken.substring(
              0,
              20
            )}...`,
          });
        },
      });

      client.onConnect = () => {
        logger.info("WebSocket 연결 성공");
        setStatus("CONNECTED");
        reconnectAttemptsRef.current = 0; // 연결 성공 시 재시도 횟수 초기화

        // 파티 채팅 구독
        partySubscriptionRef.current = client.subscribe(
          `/topic/party/${partyId}`,
          (message) => {
            try {
              const data: WebSocketMessage = JSON.parse(message.body);
              logger.debug("파티 메시지 수신:", data);

              setMessages((prev) => [...prev, data]);
              onMessageRef.current?.(data);
            } catch (error) {
              logger.error("파티 메시지 파싱 오류:", error);
            }
          }
        );

        // 개별 메시지 구독 (KICK, ERROR 등)
        userSubscriptionRef.current = client.subscribe(
          "/user/queue",
          (message) => {
            try {
              const data: WebSocketMessage = JSON.parse(message.body);
              logger.debug("개별 메시지 수신:", data);

              if (data.type === "KICK") {
                logger.warn("파티에서 강퇴되었습니다.");
                onKickRef.current?.();
              } else if (data.type === "ERROR") {
                logger.error("웹소켓 에러 메시지:", data.message);
                onErrorRef.current?.(data);
              }
            } catch (error) {
              logger.error("개별 메시지 파싱 오류:", error);
            }
          }
        );
      };

      client.onStompError = async (frame) => {
        logger.error("STOMP 에러:", {
          headers: frame.headers,
          body: frame.body,
          command: frame.command,
          message: frame.headers?.message,
        });

        // 401 에러인 경우 토큰 갱신 시도
        if (
          (frame.headers?.message?.includes("401") ||
            frame.headers?.message?.includes("Unauthorized")) &&
          !isRefreshingRef.current &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          isRefreshingRef.current = true;
          reconnectAttemptsRef.current++;

          logger.info(
            `인증 에러 발생, 토큰 갱신 시도 (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
          );

          try {
            const success = await refreshAccessToken();
            if (success) {
              logger.info("토큰 갱신 성공, 재연결 시도");
              // 5초 후 재연결
              if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
              }
              reconnectTimeoutRef.current = setTimeout(() => {
                disconnect();
                connect();
              }, 5000); // 5초 대기
              return;
            } else {
              logger.error("토큰 갱신 실패");
            }
          } catch (error) {
            logger.error("토큰 갱신 중 오류:", error);
          } finally {
            isRefreshingRef.current = false;
          }
        }

        if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          logger.error("최대 재연결 시도 횟수 초과");
        }

        setStatus("ERROR");
        onErrorRef.current?.(frame);
      };

      client.onWebSocketError = async (error) => {
        logger.error("WebSocket 에러:", {
          error: error.toString(),
          message: error.message,
          type: error.type,
          target: error.target,
        });

        // 401 에러인 경우 토큰 갱신 시도
        if (
          (error.toString().includes("401") ||
            error.toString().includes("Unauthorized")) &&
          !isRefreshingRef.current &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          isRefreshingRef.current = true;
          reconnectAttemptsRef.current++;

          logger.info(
            `인증 에러 발생, 토큰 갱신 시도 (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
          );

          try {
            const success = await refreshAccessToken();
            if (success) {
              logger.info("토큰 갱신 성공, 재연결 시도");
              // 5초 후 재연결
              if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
              }
              reconnectTimeoutRef.current = setTimeout(() => {
                disconnect();
                connect();
              }, 5000); // 5초 대기
              return;
            } else {
              logger.error("토큰 갱신 실패");
            }
          } catch (error) {
            logger.error("토큰 갱신 중 오류:", error);
          } finally {
            isRefreshingRef.current = false;
          }
        }

        if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          logger.error("최대 재연결 시도 횟수 초과");
        }

        setStatus("ERROR");
        onErrorRef.current?.(error);
      };

      client.onWebSocketClose = () => {
        logger.info("WebSocket 연결 종료");
        setStatus("DISCONNECTED");
      };

      client.activate();
      clientRef.current = client;
    } catch (error) {
      logger.error("WebSocket 연결 실패:", error);
      setStatus("ERROR");
      onErrorRef.current?.(error);
    }
  }, [partyId]); // partyId만 의존성으로 유지

  // 웹소켓 연결 해제
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (clientRef.current) {
      if (partySubscriptionRef.current) {
        partySubscriptionRef.current.unsubscribe();
        partySubscriptionRef.current = null;
      }
      if (userSubscriptionRef.current) {
        userSubscriptionRef.current.unsubscribe();
        userSubscriptionRef.current = null;
      }
      clientRef.current.deactivate();
      clientRef.current = null;
      setStatus("DISCONNECTED");
      logger.info("WebSocket 연결 해제");
    }
  }, []);

  // 메시지 전송
  const sendMessage = useCallback((payload: SendMessagePayload) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(payload),
      });
      logger.debug("메시지 전송:", payload);
    } else {
      logger.error("WebSocket이 연결되지 않았습니다.");
    }
  }, []);

  // 컴포넌트 마운트 시 연결
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    status,
    messages,
    sendMessage,
    connect,
    disconnect,
  };
};
