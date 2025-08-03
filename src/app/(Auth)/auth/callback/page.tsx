"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { useToast } from "@/features/common/Toast";

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
        // URL 파라미터에서 에러 확인
        const errorParam = searchParams.get("error");
        if (errorParam) {
          setError(`OAuth 인증 실패: ${errorParam}`);
          setIsProcessing(false);
          return;
        }

        // 액세스 토큰 파라미터 확인 (직접 토큰이 전달된 경우)
        const accessTokenParam = searchParams.get("accessToken");
        if (accessTokenParam) {
          setAccessToken(accessTokenParam);
          showToast("OAuth 로그인 성공!", "success");
          router.push("/");
          return;
        }

        // 코드 파라미터 확인 (기존 OAuth 플로우)
        const code = searchParams.get("code");
        if (!code) {
          setError("인증 코드를 찾을 수 없습니다.");
          setIsProcessing(false);
          return;
        }

        // OAuth 코드를 서버에 전송하여 토큰 교환
        try {
          const response = await axiosInstance.post("/oauth2/callback", {
            code: code,
            redirectUri: `${window.location.origin}/auth/callback`,
          });

          // 응답에서 토큰 추출
          const accessToken =
            response.data.accessToken ||
            response.headers?.authorization?.replace("Bearer ", "");
          if (accessToken) {
            setAccessToken(accessToken);
          }

          // 토큰 확인
          const savedAccessToken = getAccessToken();
          const refreshToken = getToken("refreshToken");

          if (savedAccessToken || refreshToken) {
            showToast("OAuth 로그인 성공!", "success");
            router.push("/");
            return;
          } else {
            showToast("추가 정보를 입력해주세요.", "info");
            router.push("/oauth/signup");
          }
        } catch (tokenError) {
          // 토큰 교환 실패 시 기존 방식으로 토큰 확인
          let retryCount = 0;
          const maxRetries = 10;

          const checkTokens = () => {
            const accessToken = getAccessToken();
            const refreshToken = getToken("refreshToken");

            if (accessToken || refreshToken) {
              showToast("OAuth 로그인 성공!", "success");
              router.push("/");
              return;
            }

            retryCount++;
            if (retryCount < maxRetries) {
              setTimeout(checkTokens, 500);
            } else {
              showToast("추가 정보를 입력해주세요.", "info");
              router.push("/oauth/signup");
            }
          };

          // 첫 번째 토큰 확인 시작
          setTimeout(checkTokens, 1000);
        }
      } catch (err) {
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
