"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useToast } from "@/features/common/Toast";
import Toast from "@/features/common/Toast";
import { confirmPayment } from "@/utils/tossPayments";

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const paymentKey = searchParams.get("paymentKey");
        const orderId = searchParams.get("orderId");
        const amount = searchParams.get("amount");

        if (!paymentKey || !orderId || !amount) {
          setError("결제 정보가 올바르지 않습니다.");
          setIsProcessing(false);
          return;
        }

        // 결제 확인 API 호출
        await confirmPayment(paymentKey, orderId, parseInt(amount));

        showToast("결제가 성공적으로 완료되었습니다!", "success");
        setIsProcessing(false);
      } catch (error) {
        console.error("결제 처리 실패:", error);
        setError("결제 처리 중 오류가 발생했습니다.");
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams, showToast]);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoProfile = () => {
    router.push("/profile");
  };

  if (isProcessing) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6">결제를 처리하고 있습니다...</Typography>
      </Box>
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
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <Paper elevation={3} sx={{ p: 6, maxWidth: 500, width: "100%" }}>
          {error ? (
            <Stack spacing={3} alignItems="center">
              <Alert severity="error" sx={{ width: "100%" }}>
                {error}
              </Alert>
              <Button variant="contained" onClick={handleGoHome}>
                홈으로 돌아가기
              </Button>
            </Stack>
          ) : (
            <Stack spacing={4} alignItems="center">
              <CheckCircleIcon sx={{ fontSize: 80, color: "success.main" }} />
              <Typography variant="h4" fontWeight={700} textAlign="center">
                결제 성공!
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
              >
                예약이 성공적으로 완료되었습니다.
                <br />
                예약 내역은 프로필에서 확인할 수 있습니다.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                <Button variant="outlined" fullWidth onClick={handleGoHome}>
                  홈으로
                </Button>
                <Button variant="contained" fullWidth onClick={handleGoProfile}>
                  예약 내역 보기
                </Button>
              </Stack>
            </Stack>
          )}
        </Paper>
      </Box>
    </>
  );
};

const PaymentSuccessPage = () => {
  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          gap={2}
        >
          <CircularProgress size={60} />
          <Typography variant="h6">페이지를 로딩하고 있습니다...</Typography>
        </Box>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;
