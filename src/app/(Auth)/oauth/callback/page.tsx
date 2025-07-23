"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { useToast } from "@/features/common/Toast";
import Toast from "@/features/common/Toast";
import { getToken } from "@/api/client";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, showToast, hideToast } = useToast();
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

        // 코드 파라미터 확인
        const code = searchParams.get("code");
        if (!code) {
          setError("인증 코드를 찾을 수 없습니다.");
          setIsProcessing(false);
          return;
        }

        // 잠시 대기 후 토큰 확인
        setTimeout(() => {
          const refreshToken = getToken("refreshToken");
          if (refreshToken) {
            showToast("OAuth 로그인 성공!", "success");
            router.push("/");
          } else {
            // 토큰이 없으면 추가 정보 입력 페이지로 이동
            showToast("추가 정보를 입력해주세요.", "info");
            router.push("/oauth/signup");
          }
        }, 1000);
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
      <>
        <Toast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={hideToast}
        />
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
      </>
    );
  }

  return (
    <>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={hideToast}
      />
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
    </>
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
