import React from "react";
import {
  Paper,
  Stack,
  Avatar,
  Box,
  Typography,
  Chip,
  Button,
  Rating,
} from "@mui/material";
import dayjs from "dayjs";
import type { MyReservationResponse, MyReviewResponse } from "@/api/generated";

interface ReservationItemProps {
  reservation: MyReservationResponse;
  onReviewClick: () => void;
  hasReview: boolean;
}

const ReservationItem = ({
  reservation,
  onReviewClick,
  hasReview,
}: ReservationItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return { bgcolor: "#ff9800", color: "#fff" };
      case "CONFIRMED":
        return { bgcolor: "#1976d2", color: "#fff" };
      case "CANCELLED":
        return { bgcolor: "#bdbdbd", color: "#fff" };
      case "REFUSED":
        return { bgcolor: "#f44336", color: "#fff" };
      case "TERMINATED":
        return { bgcolor: "#43a047", color: "#fff" };
      default:
        return { bgcolor: "#bdbdbd", color: "#fff" };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "예약 확인 중";
      case "CONFIRMED":
        return "예약 확정";
      case "CANCELLED":
        return "예약 취소";
      case "REFUSED":
        return "예약 거절";
      case "TERMINATED":
        return "이용 완료";
      default:
        return status;
    }
  };

  const isCompleted = reservation.status === "TERMINATED";
  const canReview = isCompleted && !hasReview;

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src="/logo.png"
          variant="rounded"
          sx={{ width: 60, height: 60 }}
        />
        <Box flex={1}>
          <Typography fontWeight={600}>{reservation.shopName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {dayjs(reservation.reservedAt).format("YYYY.MM.DD ddd A h:mm")} |{" "}
            {reservation.headCount}명
            {isCompleted && (
              <Chip
                label="이용완료"
                color="default"
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            예약자: {reservation.name} | 예약금:{" "}
            {reservation.reservationFee?.toLocaleString()}원
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={getStatusLabel(reservation.status || "")}
            sx={getStatusColor(reservation.status || "")}
            size="small"
          />

          {canReview && (
            <Button
              variant="contained"
              size="small"
              sx={{
                bgcolor: "#29b6f6",
                color: "#fff",
                "&:hover": { bgcolor: "#0288d1" },
              }}
              onClick={onReviewClick}
            >
              리뷰 작성
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ReservationItem;
