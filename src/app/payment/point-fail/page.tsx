"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Paper, Typography, Stack, Button, Alert } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { useToast } from "@/features/common/Toast";

const PointFailContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast, hideToast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const code = searchParams.get("code");
    const message = searchParams.get("message");

    let errorMsg = "포인트 충전에 실패했습니다.";

    if (code && message) {
      switch (code) {
        case "PAY_PROCESS_CANCELED":
          errorMsg = "포인트 충전이 취소되었습니다.";
          break;
        case "PAY_PROCESS_ABORTED":
          errorMsg = "포인트 충전이 중단되었습니다.";
          break;
        default:
          errorMsg = message;
      }
    }

    setErrorMessage(errorMsg);
    showToast(errorMsg, "error");
  }, [searchParams, showToast]);

  const handleRetry = () => {
    router.push("/profile");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <Paper elevation={3} sx={{ p: 6, maxWidth: 500, width: "100%" }}>
          <Stack spacing={4} alignItems="center">
            <ErrorIcon sx={{ fontSize: 80, color: "error.main" }} />
            <Typography variant="h4" fontWeight={700} textAlign="center">
              포인트 충전 실패
            </Typography>
            <Alert severity="error" sx={{ width: "100%" }}>
              {errorMessage}
            </Alert>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              포인트 충전 중 문제가 발생했습니다.
              <br />
              다시 시도하거나 다른 방법으로 충전해주세요.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
              <Button variant="outlined" fullWidth onClick={handleGoHome}>
                홈으로
              </Button>
              <Button variant="contained" fullWidth onClick={handleRetry}>
                다시 시도
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </>
  );
};

export default function PointFailPage() {
  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          bgcolor="background.default"
        >
          <Typography variant="h6" color="text.secondary">
            로딩 중...
          </Typography>
        </Box>
      }
    >
      <PointFailContent />
    </Suspense>
  );
}
