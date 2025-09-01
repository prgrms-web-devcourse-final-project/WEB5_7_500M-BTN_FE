"use client";

import {
  Box,
  Button,
  Stack,
  Typography,
  Link,
  CircularProgress,
  Alert,
} from "@mui/material";
import Image from "next/image";
import { useOAuth2Urls } from "@/api/hooks";

export default function OAuthBox() {
  const { data: oauthUrls, isLoading, error } = useOAuth2Urls();

  // API 기본 URL
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://matjalalzz.store";

  // 기본 OAuth URL (API에서 가져오지 못할 경우 사용)
  const defaultOAuthUrls = {
    google: `${API_BASE_URL}/oauth2/authorization/google`,
    kakao: `${API_BASE_URL}/oauth2/authorization/kakao`,
    naver: `${API_BASE_URL}/oauth2/authorization/naver`,
  };

  // API에서 가져온 URL이 있으면 서버 URL과 결합, 없으면 기본 URL 사용
  const urls = oauthUrls
    ? {
        google: oauthUrls.google?.startsWith("http")
          ? oauthUrls.google
          : `${API_BASE_URL}${oauthUrls.google}`,
        kakao: oauthUrls.kakao?.startsWith("http")
          ? oauthUrls.kakao
          : `${API_BASE_URL}${oauthUrls.kakao}`,
        naver: oauthUrls.naver?.startsWith("http")
          ? oauthUrls.naver
          : `${API_BASE_URL}${oauthUrls.naver}`,
      }
    : defaultOAuthUrls;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <>
      <Stack spacing={1}>
        {urls.google && (
          <Button
            fullWidth
            variant="contained"
            startIcon={
              <Image
                src="/oauth_google.png"
                alt="Google"
                width={24}
                height={24}
              />
            }
            onClick={() => {
              const callbackUrl = `${window.location.origin}/oauth/callback`;
              const oauthUrl = `${
                urls.google
              }?redirect_uri=${encodeURIComponent(callbackUrl)}`;
              window.location.href = oauthUrl;
            }}
            sx={{
              height: "40px",
              borderColor: "#E0E0E0",
              color: "#000000",
              backgroundColor: "#FFFFFF",
              py: 1,
              borderRadius: 1,
            }}
          >
            구글로 계속하기
          </Button>
        )}

        {urls.kakao && (
          <Button
            fullWidth
            variant="contained"
            startIcon={
              <Image
                src="/oauth_kakao.png"
                alt="Kakao"
                width={16}
                height={16}
              />
            }
            onClick={() => {
              const callbackUrl = `${window.location.origin}/oauth/callback`;
              const oauthUrl = `${urls.kakao}?redirect_uri=${encodeURIComponent(
                callbackUrl
              )}`;
              window.location.href = oauthUrl;
            }}
            sx={{
              height: "40px",
              backgroundColor: "#FEE500",
              color: "#000000",
              py: 1.5,
              borderRadius: 1,
            }}
          >
            카카오로 계속하기
          </Button>
        )}

        {urls.naver && (
          <Button
            fullWidth
            variant="contained"
            startIcon={
              <Image
                src="/oauth_naver.png"
                alt="Naver"
                width={30}
                height={30}
              />
            }
            onClick={() => {
              const callbackUrl = `${window.location.origin}/oauth/callback`;
              const oauthUrl = `${urls.naver}?redirect_uri=${encodeURIComponent(
                callbackUrl
              )}`;
              window.location.href = oauthUrl;
            }}
            sx={{
              height: "40px",
              backgroundColor: "#03C75A",
              color: "#FFFFFF",
              py: 1.5,
              borderRadius: 1,
            }}
          >
            네이버로 계속하기
          </Button>
        )}
      </Stack>

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          아직 계정이 없으신가요?{" "}
          <Link
            href="/sign-up"
            sx={{
              color: "primary.main",
              textDecoration: "none",
              fontWeight: 600,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            회원가입
          </Link>
        </Typography>
      </Box>
    </>
  );
}
