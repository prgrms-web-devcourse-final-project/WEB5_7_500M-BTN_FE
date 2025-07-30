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
import { useQueryClient } from "@tanstack/react-query";

const PointSuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast, hideToast } = useToast();
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

        // 포인트 정보 새로고침
        queryClient.invalidateQueries({ queryKey: ["myInfo"] });

        showToast("포인트 충전이 성공적으로 완료되었습니다!", "success");
        setIsProcessing(false);
      } catch (error) {
        console.error("포인트 충전 처리 실패:", error);
        setError("포인트 충전 처리 중 오류가 발생했습니다.");
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

  if (error) {
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
              <Alert severity="error" sx={{ width: "100%" }}>
                {error}
              </Alert>
              <Typography variant="h6" color="text.secondary">
                포인트 충전에 실패했습니다.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                <Button variant="outlined" fullWidth onClick={handleGoHome}>
                  홈으로
                </Button>
                <Button variant="contained" fullWidth onClick={handleGoProfile}>
                  프로필로
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </>
    );
  }

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
            {isProcessing ? (
              <>
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary">
                  포인트 충전 처리 중...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  잠시만 기다려주세요.
                </Typography>
              </>
            ) : (
              <>
                <CheckCircleIcon sx={{ fontSize: 80, color: "success.main" }} />
                <Typography variant="h4" fontWeight={700} textAlign="center">
                  포인트 충전 완료!
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                >
                  포인트가 성공적으로 충전되었습니다.
                  <br />
                  이제 포인트로 예약금을 결제할 수 있습니다.
                </Typography>
                <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                  <Button variant="outlined" fullWidth onClick={handleGoHome}>
                    홈으로
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleGoProfile}
                  >
                    프로필로
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </Paper>
      </Box>
    </>
  );
};

export default function PointSuccessPage() {
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
          <CircularProgress size={60} />
        </Box>
      }
    >
      <PointSuccessContent />
    </Suspense>
  );
}
