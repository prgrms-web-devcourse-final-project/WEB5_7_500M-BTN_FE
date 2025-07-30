import React from "react";
import {
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import ReservationItem from "./ReservationItem";
import ReviewDialog from "./ReviewDialog";
import { useMyReservations, useMyReviews } from "@/api/hooks";
import { useToast } from "@/features/common/Toast";
import Toast from "@/features/common/Toast";
import type { MyReservationResponse, MyReviewResponse } from "@/api/generated";

const ProfileReservationsTab = () => {
  const [filter, setFilter] = React.useState<string>("all");
  const [reviewDialogOpen, setReviewDialogOpen] = React.useState(false);
  const [reviewTarget, setReviewTarget] =
    React.useState<MyReservationResponse | null>(null);
  const [reviewContent, setReviewContent] = React.useState("");
  const [reviewRating, setReviewRating] = React.useState(4.0);
  const { showToast, hideToast } = useToast();

  // API 훅 사용
  const {
    data: reservationsData,
    isLoading: reservationsLoading,
    error: reservationsError,
  } = useMyReservations();
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useMyReviews();

  const reservations = reservationsData?.data?.content || [];
  const reviews = reviewsData?.data?.content || [];

  // 예약 상태별 필터링
  const filteredReservations = reservations.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  // 리뷰 작성 다이얼로그 열기
  const handleOpenReviewDialog = (reservation: MyReservationResponse) => {
    setReviewTarget(reservation);
    setReviewContent("");
    setReviewRating(4.0);
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setReviewTarget(null);
    setReviewContent("");
    setReviewRating(4.0);
  };

  const handleSaveReview = () => {
    // ReviewDialog에서 API 호출을 처리하므로 여기서는 다이얼로그만 닫음
    handleCloseReviewDialog();
  };

  if (reservationsLoading || reviewsLoading) {
    return (
      <Stack alignItems="center" spacing={2} py={4}>
        <CircularProgress />
        <Typography>예약 정보를 불러오는 중...</Typography>
      </Stack>
    );
  }

  if (reservationsError || reviewsError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        예약 정보를 불러오는데 실패했습니다.
      </Alert>
    );
  }

  return (
    <>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={600}>
          내 예약 목록
        </Typography>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>상태별 필터</InputLabel>
          <Select
            value={filter}
            label="상태별 필터"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">전체</MenuItem>
            <MenuItem value="PENDING">예약 확인 중</MenuItem>
            <MenuItem value="CONFIRMED">예약 확정</MenuItem>
            <MenuItem value="CANCELLED">예약 취소</MenuItem>
            <MenuItem value="REFUSED">예약 거절</MenuItem>
            <MenuItem value="TERMINATED">예약 종료</MenuItem>
          </Select>
        </FormControl>

        <Stack spacing={1}>
          {filteredReservations.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={4}>
              {filter === "all"
                ? "예약 내역이 없습니다."
                : "해당 상태의 예약이 없습니다."}
            </Typography>
          ) : (
            filteredReservations.map((reservation) => (
              <ReservationItem
                key={reservation.reservationId}
                reservation={reservation}
                onReviewClick={() => handleOpenReviewDialog(reservation)}
                hasReview={reviews.some(
                  (r) => r.shopName === reservation.shopName
                )}
              />
            ))
          )}
        </Stack>

        <ReviewDialog
          open={reviewDialogOpen}
          onClose={handleCloseReviewDialog}
          onSave={handleSaveReview}
          reviewTarget={reviewTarget}
          reviewContent={reviewContent}
          setReviewContent={setReviewContent}
          reviewRating={reviewRating}
          setReviewRating={setReviewRating}
        />
      </Stack>
    </>
  );
};

export default ProfileReservationsTab;
