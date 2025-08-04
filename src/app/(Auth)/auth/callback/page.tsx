"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Paper,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { CheckCircle, Error, Info } from "@mui/icons-material";
import { useToast } from "@/features/common/Toast";
import Image from "next/image";

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
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "processing" | "success" | "error" | "redirecting"
  >("processing");

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // 진행률 애니메이션 시작
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        // URL 파라미터에서 에러 확인
        const errorParam = searchParams.get("error");
        if (errorParam) {
          clearInterval(progressInterval);
          setProgress(100);
          setStatus("error");
          setError(`OAuth 인증 실패: ${errorParam}`);
          setIsProcessing(false);
          return;
        }

        // 액세스 토큰 파라미터 확인 (직접 토큰이 전달된 경우)
        const accessTokenParam = searchParams.get("accessToken");
        if (accessTokenParam) {
          setAccessToken(accessTokenParam);
          setStatus("success");
          setProgress(100);
          showToast("OAuth 로그인 성공!", "success");
          setTimeout(() => {
            setStatus("redirecting");
            router.push("/");
          }, 1500);
          return;
        }

        // 코드 파라미터 확인 (기존 OAuth 플로우)
        const code = searchParams.get("code");
        if (!code) {
          clearInterval(progressInterval);
          setProgress(100);
          setStatus("error");
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
            // 토큰이 있으면 내 정보 API를 호출하여 403 에러 확인
            try {
              await axiosInstance.get("/users/my-info");
              // 403 에러가 발생하지 않으면 정상 로그인
              clearInterval(progressInterval);
              setProgress(100);
              setStatus("success");
              showToast("OAuth 로그인 성공!", "success");
              setTimeout(() => {
                setStatus("redirecting");
                router.push("/");
              }, 1500);
              return;
            } catch (myInfoError) {
              // 403 에러가 발생하면 추가회원가입 페이지로 리다이렉트
              if (
                myInfoError &&
                typeof myInfoError === "object" &&
                "response" in myInfoError
              ) {
                const apiError = myInfoError as {
                  response?: { status?: number };
                };
                if (apiError.response?.status === 403) {
                  clearInterval(progressInterval);
                  setProgress(100);
                  setStatus("success");
                  showToast("추가 정보를 입력해주세요.", "info");
                  setTimeout(() => {
                    setStatus("redirecting");
                    router.push("/auth/signup");
                  }, 1500);
                  return;
                }
              }
              // 다른 에러는 그대로 던짐
              throw myInfoError;
            }
          } else {
            clearInterval(progressInterval);
            setProgress(100);
            setStatus("success");
            showToast("추가 정보를 입력해주세요.", "info");
            setTimeout(() => {
              setStatus("redirecting");
              router.push("/auth/signup");
            }, 1500);
          }
        } catch (tokenError) {
          // 토큰 교환 실패 시 기존 방식으로 토큰 확인
          let retryCount = 0;
          const maxRetries = 10;

          const checkTokens = () => {
            const accessToken = getAccessToken();
            const refreshToken = getToken("refreshToken");

            if (accessToken || refreshToken) {
              // 토큰이 있으면 내 정보 API를 호출하여 403 에러 확인
              axiosInstance
                .get("/users/my-info")
                .then(() => {
                  // 403 에러가 발생하지 않으면 정상 로그인
                  clearInterval(progressInterval);
                  setProgress(100);
                  setStatus("success");
                  showToast("OAuth 로그인 성공!", "success");
                  setTimeout(() => {
                    setStatus("redirecting");
                    router.push("/");
                  }, 1500);
                })
                .catch((myInfoError) => {
                  // 403 에러가 발생하면 추가회원가입 페이지로 리다이렉트
                  if (
                    myInfoError &&
                    typeof myInfoError === "object" &&
                    "response" in myInfoError
                  ) {
                    const apiError = myInfoError as {
                      response?: { status?: number };
                    };
                    if (apiError.response?.status === 403) {
                      clearInterval(progressInterval);
                      setProgress(100);
                      setStatus("success");
                      showToast("추가 정보를 입력해주세요.", "info");
                      setTimeout(() => {
                        setStatus("redirecting");
                        router.push("/auth/signup");
                      }, 1500);
                      return;
                    }
                  }
                  // 다른 에러는 정상 로그인으로 처리
                  clearInterval(progressInterval);
                  setProgress(100);
                  setStatus("success");
                  showToast("OAuth 로그인 성공!", "success");
                  setTimeout(() => {
                    setStatus("redirecting");
                    router.push("/");
                  }, 1500);
                });
              return;
            }

            retryCount++;
            if (retryCount < maxRetries) {
              setTimeout(checkTokens, 500);
            } else {
              clearInterval(progressInterval);
              setProgress(100);
              setStatus("success");
              showToast("추가 정보를 입력해주세요.", "info");
              setTimeout(() => {
                setStatus("redirecting");
                router.push("/auth/signup");
              }, 1500);
            }
          };

          // 첫 번째 토큰 확인 시작
          setTimeout(checkTokens, 1000);
        }
      } catch (err) {
        setProgress(100);
        setStatus("error");
        setError("OAuth 인증 처리 중 오류가 발생했습니다.");
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, router, showToast]);

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle sx={{ fontSize: 60, color: "success.main" }} />;
      case "error":
        return <Error sx={{ fontSize: 60, color: "error.main" }} />;
      case "redirecting":
        return <Info sx={{ fontSize: 60, color: "info.main" }} />;
      default:
        return <CircularProgress size={60} />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "success":
        return "인증 성공!";
      case "error":
        return "인증 실패";
      case "redirecting":
        return "페이지 이동 중...";
      default:
        return "OAuth 인증 처리 중...";
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case "success":
        return "인증이 완료되었습니다.";
      case "error":
        return error || "인증 처리 중 오류가 발생했습니다.";
      case "redirecting":
        return "잠시만 기다려주세요.";
      default:
        return "잠시만 기다려주세요.";
    }
  };

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
          p: 2,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              style={{ marginBottom: 16 }}
            />
            <Typography variant="h6" gutterBottom>
              인증 실패
            </Typography>
          </Box>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body2">{error}</Typography>
          </Alert>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ cursor: "pointer", textAlign: "center" }}
            onClick={() => router.push("/sign-in")}
          >
            로그인 페이지로 돌아가기
          </Typography>
        </Paper>
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
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={48}
            height={48}
            style={{ marginBottom: 16 }}
          />
          <Typography variant="h6" gutterBottom>
            OAuth 인증
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", mb: 3 }}>{getStatusIcon()}</Box>

        <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
          {getStatusText()}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mb: 3 }}
        >
          {getStatusDescription()}
        </Typography>

        <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: "center", display: "block" }}
        >
          {progress}% 완료
        </Typography>
      </Paper>
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
          <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
            <Box sx={{ textAlign: "center" }}>
              <Image
                src="/logo.png"
                alt="Logo"
                width={48}
                height={48}
                style={{ marginBottom: 16 }}
              />
              <Typography variant="h6" gutterBottom>
                로딩 중...
              </Typography>
            </Box>
          </Paper>
        </Box>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
