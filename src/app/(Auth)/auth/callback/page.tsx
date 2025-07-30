"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { useToast } from "@/features/common/Toast";
import Toast from "@/features/common/Toast";
import {
  getToken,
  getAccessToken,
  setAccessToken,
  axiosInstance,
} from "@/api/client";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast, hideToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // 현재 URL 정보 로깅
        console.log("OAuth 콜백 페이지 접근:", {
          currentUrl: window.location.href,
          searchParams: Object.fromEntries(searchParams.entries()),
          origin: window.location.origin,
          pathname: window.location.pathname,
        });

        // URL 파라미터에서 에러 확인
        const errorParam = searchParams.get("error");
        if (errorParam) {
          console.error("OAuth 에러 파라미터 발견:", errorParam);
          setError(`OAuth 인증 실패: ${errorParam}`);
          setIsProcessing(false);
          return;
        }

        // 코드 파라미터 확인
        const code = searchParams.get("code");
        if (!code) {
          console.error("OAuth 코드 파라미터 없음");
          setError("인증 코드를 찾을 수 없습니다.");
          setIsProcessing(false);
          return;
        }

        console.log("OAuth 콜백 처리 시작", {
          code: code.substring(0, 10) + "...",
        });

        // OAuth 코드를 서버에 전송하여 토큰 교환
        try {
          const response = await axiosInstance.post("/oauth2/callback", {
            code: code,
            redirectUri: `${window.location.origin}/oauth/callback`,
          });

          console.log("OAuth 토큰 교환 응답:", response.data);

          // 응답에서 토큰 추출
          const accessToken =
            response.data.accessToken ||
            response.headers?.authorization?.replace("Bearer ", "");
          if (accessToken) {
            setAccessToken(accessToken);
            console.log("액세스 토큰 저장됨");
          }

          // 토큰 확인
          const savedAccessToken = getAccessToken();
          const refreshToken = getToken("refreshToken");

          if (savedAccessToken || refreshToken) {
            console.log("토큰 확인됨, 로그인 성공");
            showToast("OAuth 로그인 성공!", "success");
            router.push("/");
            return;
          } else {
            console.log("토큰이 없음, 추가 정보 입력 페이지로 이동");
            showToast("추가 정보를 입력해주세요.", "info");
            router.push("/oauth/signup");
          }
        } catch (tokenError) {
          console.error("토큰 교환 실패:", tokenError);

          // 토큰 교환 실패 시 기존 방식으로 토큰 확인
          let retryCount = 0;
          const maxRetries = 10;

          const checkTokens = () => {
            const accessToken = getAccessToken();
            const refreshToken = getToken("refreshToken");

            console.log("토큰 확인 시도", {
              retryCount,
              hasAccessToken: !!accessToken,
              hasRefreshToken: !!refreshToken,
            });

            if (accessToken || refreshToken) {
              console.log("토큰 발견, 로그인 성공");
              showToast("OAuth 로그인 성공!", "success");
              router.push("/");
              return;
            }

            retryCount++;
            if (retryCount < maxRetries) {
              setTimeout(checkTokens, 500);
            } else {
              console.log("토큰 확인 실패, 추가 정보 입력 페이지로 이동");
              showToast("추가 정보를 입력해주세요.", "info");
              router.push("/oauth/signup");
            }
          };

          // 첫 번째 토큰 확인 시작
          setTimeout(checkTokens, 1000);
        }
      } catch (err) {
        console.error("OAuth 콜백 처리 중 오류:", err);
        setError("OAuth 인증 처리 중 오류가 발생했습니다.");
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, router, showToast]);

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          <Typography variant="h6" gutterBottom>
            인증 실패
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ cursor: "pointer" }}
          onClick={() => router.push("/sign-in")}
        >
          로그인 페이지로 돌아가기
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 2,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        OAuth 인증 처리 중...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        잠시만 기다려주세요.
      </Typography>
    </Box>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            로딩 중...
          </Typography>
        </Box>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
