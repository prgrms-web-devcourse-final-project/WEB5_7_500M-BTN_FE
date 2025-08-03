import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Stack,
  Divider,
  Chip,
  Badge,
  useTheme,
  Fade,
  Alert,
  CircularProgress,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import PaymentIcon from "@mui/icons-material/Payment";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import type { PartyInfo, WebSocketMessage } from "@/types/chat";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useRestoreChat, usePayPartyFee } from "@/api/hooks";
import { useAuth } from "@/hooks/useAuth";

dayjs.locale("ko");

interface ChatRoomProps {
  party: PartyInfo;
  onClose: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ party, onClose }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  // 채팅 기록 복구
  const {
    data: restoreData,
    isLoading: isLoadingHistory,
    error: restoreError,
  } = useRestoreChat(Number(party.id));

  // 파티 예약금 지불 훅
  const payPartyFeeMutation = usePayPartyFee();

  // 콜백 함수들을 useCallback으로 안정화
  const handleWebSocketMessage = useCallback((newMessage: WebSocketMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const handleWebSocketError = useCallback((error: any) => {
    console.error("웹소켓 에러:", error);
  }, []);

  const handleWebSocketKick = useCallback(() => {
    alert("파티에서 강퇴되었습니다.");
    onClose();
  }, [onClose]);

  // 웹소켓 연결
  const { status, sendMessage, connect, disconnect } = useWebSocket({
    partyId: Number(party.id),
    onMessage: handleWebSocketMessage,
    onError: handleWebSocketError,
    onKick: handleWebSocketKick,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 채팅 기록 로드
  useEffect(() => {
    if (restoreData?.data) {
      // API 응답 데이터를 WebSocketMessage 타입으로 변환
      const convertedMessages = (restoreData.data as any[]).map((msg: any) => ({
        id: msg.id || Date.now(),
        message: msg.message || "",
        userId: msg.userId || 0,
        userNickname: msg.userNickname || "",
        userProfile: msg.userProfile || "",
        type: msg.type || "CHAT",
        sendAt: msg.sendAt || new Date().toISOString(),
        partyId: Number(party.id),
      }));
      setMessages(convertedMessages);
    }
  }, [restoreData, party.id]);

  // 채팅 복구 에러 처리
  useEffect(() => {
    if (restoreError) {
      console.error("채팅 복구 실패:", restoreError);
      // 에러가 발생해도 웹소켓 연결은 계속 유지
    }
  }, [restoreError]);

  const handleSendMessage = () => {
    if (!message.trim() || status !== "CONNECTED") return;

    sendMessage({
      message: message.trim(),
      partyId: Number(party.id),
    });

    setMessage("");
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return dayjs(date).format("M월 D일 A h:mm");
  };

  const renderMessage = (msg: WebSocketMessage) => {
    const isMyMessage = msg.userId === user?.userId;

    // 시스템 메시지 처리
    if (msg.type !== "CHAT") {
      return (
        <Box
          key={msg.id}
          sx={{
            display: "flex",
            justifyContent: "center",
            my: 1,
          }}
        >
          <Chip
            label={
              msg.type === "JOIN"
                ? `${msg.userNickname}님이 입장했습니다.`
                : msg.type === "LEAVE"
                ? `${msg.userNickname}님이 퇴장했습니다.`
                : msg.type === "PAYMENT_REQUEST"
                ? "예약금 지불 요청이 발생했습니다."
                : msg.type === "PAYMENT_COMPLETE"
                ? "예약금 지불이 완료되었습니다."
                : msg.type === "RESERVATION_COMPLETE"
                ? "예약이 완료되었습니다."
                : msg.type === "PARTY_DELETED"
                ? "파티가 삭제되었습니다."
                : msg.message || "시스템 메시지"
            }
            size="small"
            color="default"
            variant="outlined"
          />
        </Box>
      );
    }

    return (
      <Box
        key={msg.id}
        sx={{
          display: "flex",
          justifyContent: isMyMessage ? "flex-end" : "flex-start",
        }}
      >
        <Box
          sx={{
            maxWidth: "70%",
            display: "flex",
            flexDirection: isMyMessage ? "row-reverse" : "row",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          {!isMyMessage && (
            <Avatar src={msg.userProfile} sx={{ width: 32, height: 32 }}>
              {msg.userNickname.charAt(0)}
            </Avatar>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMyMessage ? "flex-end" : "flex-start",
            }}
          >
            {!isMyMessage && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 1, mb: 0.5, display: "block" }}
              >
                {msg.userNickname}
              </Typography>
            )}
            <Paper
              elevation={1}
              sx={{
                width: "fit-content",
                p: 1.5,
                bgcolor: isMyMessage
                  ? theme.palette.primary.main
                  : theme.palette.background.paper,
                color: isMyMessage
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.primary,
                borderRadius: 1,
                borderBottomRightRadius: isMyMessage ? "0px" : "8px",
                borderBottomLeftRadius: isMyMessage ? "8px" : "0px",
              }}
            >
              <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                {msg.message}
              </Typography>
            </Paper>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                mt: 0.5,
                display: "block",
                textAlign: isMyMessage ? "right" : "left",
              }}
            >
              {formatTime(msg.sendAt)}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePayPartyFee = async () => {
    if (!party.id) return;

    setIsPaymentLoading(true);
    try {
      await payPartyFeeMutation.mutateAsync(Number(party.id));
      alert("예약금 지불이 완료되었습니다.");
      handleMenuClose();
    } catch (error) {
      console.error("예약금 지불 실패:", error);
      // 에러는 usePayPartyFee에서 이미 처리됨
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1300,
        bgcolor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Fade in={true}>
        <Paper
          elevation={24}
          sx={{
            width: "100%",
            maxWidth: 600,
            height: "100%",
            maxHeight: 700,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* 헤더 */}
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <IconButton onClick={onClose} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Box flex={1}>
              <Typography variant="h6" fontWeight={600} noWrap>
                {party.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {party.shopName} • {party.currentCount}/{party.maxCount}명
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {status === "CONNECTING" && <CircularProgress size={16} />}
              {status === "DISCONNECTED" && <WifiOffIcon color="error" />}
              <IconButton size="small" onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>

          {/* 메뉴 Popover */}
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <List sx={{ minWidth: 200 }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handlePayPartyFee}
                  disabled={isPaymentLoading}
                >
                  <ListItemIcon>
                    {isPaymentLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <PaymentIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={isPaymentLoading ? "지불 중..." : "예약금 지불"}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Popover>

          {/* 연결 상태 알림 */}
          {status === "DISCONNECTED" && (
            <Alert severity="warning" sx={{ mx: 2, mt: 1 }}>
              연결이 끊어졌습니다. 재연결을 시도합니다.
            </Alert>
          )}

          {/* 메시지 영역 */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              bgcolor: theme.palette.grey[50],
              p: 2,
            }}
          >
            {isLoadingHistory ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Stack spacing={2}>
                {messages.map(renderMessage)}
                <div ref={messagesEndRef} />
              </Stack>
            )}
          </Box>

          {/* 입력 영역 */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder={
                  status === "CONNECTED"
                    ? "메시지를 입력하세요..."
                    : "연결 중입니다..."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="small"
                disabled={status !== "CONNECTED"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!message.trim() || status !== "CONNECTED"}
                color="primary"
                sx={{
                  bgcolor:
                    message.trim() && status === "CONNECTED"
                      ? "primary.main"
                      : "grey.300",
                  color:
                    message.trim() && status === "CONNECTED"
                      ? "white"
                      : "grey.500",
                  "&:hover": {
                    bgcolor:
                      message.trim() && status === "CONNECTED"
                        ? "primary.dark"
                        : "grey.300",
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default ChatRoom;
