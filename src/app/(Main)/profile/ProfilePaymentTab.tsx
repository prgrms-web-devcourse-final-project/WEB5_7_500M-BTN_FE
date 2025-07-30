"use client";
import React from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { usePaymentHistories } from "@/api/hooks";

dayjs.locale("ko");

const ProfilePaymentTab = () => {
  const {
    data: paymentPages,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePaymentHistories({
    size: 10,
  });

  // 모든 결제내역을 하나의 배열로 합치기
  const allPayments = React.useMemo(() => {
    if (!paymentPages?.pages) return [];
    return paymentPages.pages.flatMap((page) => page.data?.content || []);
  }, [paymentPages]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "success";
      case "FAILED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "성공";
      case "FAILED":
        return "실패";
      case "PENDING":
        return "대기중";
      default:
        return status;
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case "CARD":
        return "카드";
      case "BANK_TRANSFER":
        return "계좌이체";
      case "POINT":
        return "포인트";
      default:
        return method;
    }
  };

  if (isLoading && !allPayments.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">결제내역을 불러오는데 실패했습니다.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {allPayments.length === 0 ? (
        <Box p={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            결제내역이 없습니다.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {allPayments.map((payment) => (
            <Paper key={payment.paymentId} sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2">
                    결제 방법: {getMethodText(payment.method || "")}
                  </Typography>
                  <Chip
                    label={getStatusText(payment.status || "")}
                    color={getStatusColor(payment.status || "") as any}
                    size="small"
                  />
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="caption" color="text.secondary">
                    결제일:{" "}
                    {dayjs(payment.createdAt).format("YYYY년 MM월 DD일 HH:mm")}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {payment.totalAmount?.toLocaleString()}원
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          ))}

          {hasNextPage && (
            <Box display="flex" justifyContent="center" pt={2}>
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outlined"
                size="small"
              >
                {isFetchingNextPage ? (
                  <CircularProgress size={20} />
                ) : (
                  "더 보기"
                )}
              </Button>
            </Box>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default ProfilePaymentTab;
