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

interface ReservationItemProps {
  reservation: any;
  review: any;
  status: string;
  isPast: boolean;
  onOpenReviewDialog: (reservation: any) => void;
}

const ReservationItem = ({
  reservation,
  review,
  status,
  isPast,
  onOpenReviewDialog,
}: ReservationItemProps) => (
  <Paper variant="outlined" sx={{ p: 2 }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar src={reservation.shop.thumbnail} variant="rounded" />
      <Box flex={1}>
        <Typography fontWeight={600}>{reservation.shop.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {dayjs(reservation.date).format("YYYY.MM.DD ddd A h:mm")} |{" "}
          {reservation.people}명
          {(reservation.status === "리뷰 작성 필요" ||
            reservation.status === "리뷰 작성 완료") && (
            <Chip
              label="이용완료"
              color="default"
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
        {status === "reviewed" && review && (
          <Box mt={1} minWidth={200}>
            <Typography fontWeight={600} mb={0.5}>
              내 리뷰
            </Typography>
            <Rating
              value={review.rating}
              precision={0.5}
              readOnly
              size="small"
            />
            <Typography variant="body2" color="text.secondary" mb={1}>
              {dayjs(review.createdAt).format("YYYY.MM.DD ddd A h:mm")}
            </Typography>
            <Typography variant="body1" mb={1}>
              {review.contents}
            </Typography>
            {review.imageList && review.imageList.length > 0 && (
              <Stack direction="row" spacing={1}>
                {review.imageList.map((img: string, idx: number) => (
                  <Avatar
                    key={idx}
                    src={img}
                    variant="rounded"
                    sx={{ width: 40, height: 40 }}
                  />
                ))}
              </Stack>
            )}
            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
              onClick={() => onOpenReviewDialog(reservation)}
            >
              리뷰 수정
            </Button>
          </Box>
        )}
      </Box>
      {reservation.status === "예약 확인 중" && (
        <Chip
          label="예약 확인 중"
          sx={{ bgcolor: "#ff9800", color: "#fff" }}
          size="small"
        />
      )}
      {reservation.status === "예약 확정" && (
        <Chip
          label="예약 확정"
          sx={{ bgcolor: "#1976d2", color: "#fff" }}
          size="small"
        />
      )}
      {reservation.status === "리뷰 작성 필요" && (
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: "#29b6f6",
            color: "#fff",
            "&:hover": { bgcolor: "#0288d1" },
          }}
          onClick={() => onOpenReviewDialog(reservation)}
        >
          리뷰 작성
        </Button>
      )}
      {reservation.status === "리뷰 작성 완료" && review && (
        <Button
          variant="outlined"
          size="small"
          sx={{
            borderColor: "#43a047",
            color: "#43a047",
            "&:hover": { borderColor: "#388e3c", color: "#388e3c" },
          }}
          onClick={() => onOpenReviewDialog(reservation)}
        >
          리뷰 수정
        </Button>
      )}
      {reservation.status === "예약 취소" && (
        <Chip
          label="예약 취소"
          sx={{ bgcolor: "#bdbdbd", color: "#fff" }}
          size="small"
        />
      )}
    </Stack>
  </Paper>
);

export default ReservationItem;
