import { Box, Button, Stack, Typography, Link } from "@mui/material";
import Image from "next/image";

const OAUTH_BASE_URL = process.env.NEXT_PUBLIC_OAUTH_BASE_URL;

export default function OAuthBox() {
  return (
    <>
      <Stack spacing={1}>
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
            window.location.href = `${OAUTH_BASE_URL}/google`;
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

        <Button
          fullWidth
          variant="contained"
          startIcon={
            <Image src="/oauth_kakao.png" alt="Kakao" width={16} height={16} />
          }
          onClick={() => {
            window.location.href = `${OAUTH_BASE_URL}/kakao`;
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

        <Button
          fullWidth
          variant="contained"
          startIcon={
            <Image src="/oauth_naver.png" alt="Naver" width={30} height={30} />
          }
          onClick={() => {
            window.location.href = `${OAUTH_BASE_URL}/naver`;
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
