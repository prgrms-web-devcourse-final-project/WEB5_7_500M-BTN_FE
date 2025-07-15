import React from "react";
import {
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ReservationItem from "./ReservationItem";
import ReviewDialog from "./ReviewDialog";
import {
  shopListItems,
  shopReviews,
  ShopListItem,
  ShopReview,
} from "@/mock/shop";
import { simpleUsers, SimpleUser } from "@/mock/user";
import dayjs from "dayjs";

const currentUser: SimpleUser = simpleUsers[0];

type Reservation = {
  id: string;
  shop: ShopListItem;
  date: string;
  people: number;
  status: string;
};

const myReservations: Reservation[] = [
  {
    id: "r1",
    shop: shopListItems[0],
    date: "2024-06-20T18:00:00",
    people: 3,
    status: "예약 확인 중",
  },
  {
    id: "r2",
    shop: shopListItems[1],
    date: "2024-06-21T12:30:00",
    people: 2,
    status: "예약 확인 중",
  },
  {
    id: "r3",
    shop: shopListItems[2],
    date: "2024-06-22T19:00:00",
    people: 4,
    status: "예약 확정",
  },
  {
    id: "r4",
    shop: shopListItems[3],
    date: "2024-06-23T11:00:00",
    people: 2,
    status: "예약 확정",
  },
  {
    id: "r5",
    shop: shopListItems[4],
    date: "2024-06-10T12:30:00",
    people: 2,
    status: "리뷰 작성 필요",
  },
  {
    id: "r6",
    shop: shopListItems[5],
    date: "2024-06-11T18:00:00",
    people: 3,
    status: "리뷰 작성 필요",
  },
  {
    id: "r7",
    shop: shopListItems[0],
    date: "2024-06-09T18:00:00",
    people: 2,
    status: "리뷰 작성 완료",
  },
  {
    id: "r8",
    shop: shopListItems[1],
    date: "2024-06-08T12:30:00",
    people: 2,
    status: "리뷰 작성 완료",
  },
  {
    id: "r9",
    shop: shopListItems[2],
    date: "2024-06-07T19:00:00",
    people: 2,
    status: "예약 취소",
  },
  {
    id: "r10",
    shop: shopListItems[3],
    date: "2024-06-06T11:00:00",
    people: 1,
    status: "예약 취소",
  },
];

type MyShopReview = ShopReview & { shopId: string };

const myShopReviews: MyShopReview[] = shopReviews
  .filter((r) => r.author.id === currentUser.id)
  .map((r, idx) => ({
    ...r,
    shopId: myReservations[idx % myReservations.length].shop.id,
  }));

const reservationStatusOptions = [
  { label: "전체", value: "all" },
  { label: "예약중", value: "reserved" },
  { label: "리뷰 필요", value: "need_review" },
  { label: "리뷰 완료", value: "reviewed" },
];

function getReservationStatus(
  reservation: Reservation,
  reviews: MyShopReview[]
): "reserved" | "need_review" | "reviewed" {
  const now = dayjs();
  const isPast = dayjs(reservation.date).isBefore(now, "minute");
  const review = reviews.find(
    (r) => r.author.id === currentUser.id && r.shopId === reservation.shop.id
  );
  if (!isPast) return "reserved";
  if (review) return "reviewed";
  return "need_review";
}

const ProfileReservationsTab = () => {
  const [filter, setFilter] = React.useState<string>("all");
  const [reviewDialogOpen, setReviewDialogOpen] = React.useState(false);
  const [reviewTarget, setReviewTarget] = React.useState<Reservation | null>(
    null
  );
  const [reviewContent, setReviewContent] = React.useState("");
  const [reviewRating, setReviewRating] = React.useState(4.0);

  // 예약 상태별 필터링
  const filteredReservations = myReservations.filter((r) => {
    const status = getReservationStatus(r, myShopReviews);
    if (filter === "all") return true;
    return status === filter;
  });

  // 리뷰 작성/수정 다이얼로그 열기
  const handleOpenReviewDialog = (reservation: Reservation) => {
    setReviewTarget(reservation);
    const review = myShopReviews.find(
      (r) => r.shopId === reservation.shop.id && r.author.id === currentUser.id
    );
    setReviewContent(review ? review.contents : "");
    setReviewRating(review ? review.rating : 4.0);
    setReviewDialogOpen(true);
  };
  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setReviewTarget(null);
    setReviewContent("");
    setReviewRating(4.0);
  };
  const handleSaveReview = () => {
    alert("리뷰가 저장되었습니다. (실제 저장은 미구현)");
    handleCloseReviewDialog();
  };

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>상태 필터</InputLabel>
          <Select
            value={filter}
            label="상태 필터"
            onChange={(e) => setFilter(e.target.value)}
          >
            {reservationStatusOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Stack spacing={2}>
        {filteredReservations.length === 0 && (
          <Typography color="text.secondary">예약 내역이 없습니다.</Typography>
        )}
        {filteredReservations.map((r) => {
          const status = getReservationStatus(r, myShopReviews);
          const isPast = dayjs(r.date).isBefore(dayjs(), "minute");
          const review = myShopReviews.find(
            (rev) =>
              rev.shopId === r.shop.id && rev.author.id === currentUser.id
          );
          return (
            <ReservationItem
              key={r.id}
              reservation={r}
              review={review}
              status={status}
              isPast={isPast}
              onOpenReviewDialog={handleOpenReviewDialog}
            />
          );
        })}
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
        isEdit={
          !!reviewTarget &&
          !!myShopReviews.find((r) => r.shopId === reviewTarget.shop.id)
        }
      />
    </>
  );
};

export default ProfileReservationsTab;
