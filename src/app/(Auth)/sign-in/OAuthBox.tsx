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
  const { data: oauthResponse, isLoading, error } = useOAuth2Urls();
  const oauthUrls = oauthResponse?.data;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error || !oauthUrls) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        OAuth 서비스를 불러올 수 없습니다.
      </Alert>
    );
  }

  return (
    <>
      <Stack spacing={1}>
        {oauthUrls.google && (
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
              window.location.href = oauthUrls.google;
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

        {oauthUrls.kakao && (
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
              window.location.href = oauthUrls.kakao;
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

        {oauthUrls.naver && (
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
              window.location.href = oauthUrls.naver;
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
