"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Avatar,
  Paper,
  Rating,
  Divider,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReserveDialog from "./ReserveDialog";
import getImageLayout from "./getImageLayout";
import { useShopDetail, useShopReviews } from "@/api/hooks";
import { getCategoryLabel } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/features/common/Toast";

const ShopDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const shopId = Array.isArray(params.id) ? params.id[0] : params.id;
  const numericShopId = parseInt(shopId || "0", 10);

  const {
    data: shopData,
    isLoading: shopLoading,
    error: shopError,
  } = useShopDetail(numericShopId);
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useShopReviews(numericShopId, { size: 20 });
  const shop = shopData?.data;
  const reviews = reviewsData?.data?.content || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [reserveOpen, setReserveOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const handleImgClick = (img: string) => {
    setModalImg(img);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setModalImg(null);
  };

  if (shopLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (shopError || !shop) {
    return (
      <Box maxWidth={1200} mx="auto" px={3} py={6}>
        <Alert severity="error">식당 정보를 불러오는데 실패했습니다.</Alert>
      </Box>
    );
  }

  // 영업시간 포맷팅
  const formatTime = (time: any) => {
    if (!time) return "";

    // 문자열 형태인 경우 (HH:MM:SS)
    if (typeof time === "string") {
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    }

    // 객체 형태인 경우 (LocalTime)
    if (typeof time === "object" && time.hour !== undefined) {
      const hours = time.hour?.toString().padStart(2, "0") || "00";
      const minutes = time.minute?.toString().padStart(2, "0") || "00";
      return `${hours}:${minutes}`;
    }

    return "";
  };

  const businessHours = `${formatTime(shop.openTime)} - ${formatTime(
    shop.closeTime
  )}`;

  return (
    <Box maxWidth={1200} mx="auto" px={3} py={6}>
      <Stack direction="row" spacing={6} alignItems="flex-start">
        {/* 좌측: 이미지 + 식당 정보 */}
        <Box flex={2} minWidth={0}>
          {/* 상단: 이미지 */}
          <Box mb={4}>
            {shop.images && shop.images.length > 0 ? (
              getImageLayout(shop.images, handleImgClick)
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 300,
                  bgcolor: "grey.200",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                }}
              >
                <Typography color="text.secondary">
                  이미지가 없습니다
                </Typography>
              </Box>
            )}
          </Box>
          {/* 식당 정보 */}
          <Box sx={{ mb: 4 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              mb={0.5}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography variant="h4" fontWeight={700}>
                  {shop.shopName}
                </Typography>
                <Typography variant="h6" color="warning.main" fontWeight={600}>
                  ★ {shop.rating?.toFixed(1) || "0.0"}
                </Typography>
              </Stack>
              <Box display="flex">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => {
                    if (!isAuthenticated) {
                      showToast("로그인이 필요합니다.", "warning");
                      return;
                    }
                    setReserveOpen(true);
                  }}
                >
                  예약하기
                </Button>
              </Box>
            </Stack>
            <Typography variant="subtitle2" color="text.secondary" mb={1.5}>
              {getCategoryLabel(shop.category || "")}
            </Typography>
            <Typography variant="body1" mb={3}>
              {shop.description}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>
              {shop.roadAddress} {shop.detailAddress}
            </Typography>
            <Stack direction="row" spacing={4} mb={2}>
              <Typography variant="body2" color="text.secondary">
                영업시간: <b>{businessHours}</b>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                연락처: <b>{shop.tel}</b>
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              예약금: <b>{shop.reservationFee?.toLocaleString()}원</b>
            </Typography>
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem />
        {/* 우측: 리뷰 리스트 */}
        <Box
          flex={1.5}
          minWidth={0}
          sx={{ maxHeight: "calc(100vh - 112px)", overflowY: "auto" }}
        >
          <Box display="flex" alignItems="center" mb={2} gap={1}>
            <Typography variant="h5">리뷰</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {shop.reviewCount || reviews.length}
            </Typography>
          </Box>
          <Box overflow="auto" pr={1}>
            {reviewsLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : reviewsError ? (
              <Alert severity="error">리뷰를 불러오는데 실패했습니다.</Alert>
            ) : reviews.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                py={4}
              >
                아직 리뷰가 없습니다.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {reviews.map((review) => (
                  <Box key={review.reviewId} sx={{ p: 2 }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      mb={1}
                    >
                      <Avatar
                        src={review.userNickname}
                        alt={review.userNickname}
                      />
                      <Box>
                        <Typography fontWeight={600}>
                          {review.userNickname}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.createdAt || "").toLocaleDateString(
                            "ko-KR"
                          )}
                        </Typography>
                      </Box>
                      <Box flex={1} />
                      <Rating
                        value={review.rating}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                    </Stack>
                    <Typography variant="body2" mb={1}>
                      {review.content}
                    </Typography>
                    {review.images && review.images.length > 0 && (
                      <Box mb={1}>
                        {getImageLayout(review.images, handleImgClick)}
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Stack>
      {/* 이미지 모달 */}
      <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="md">
        <DialogContent
          sx={{ position: "relative", p: 0, bgcolor: "transparent" }}
        >
          <IconButton
            onClick={handleModalClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          {modalImg && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
              }}
            >
              <img
                src={modalImg}
                alt="확대 이미지"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: 8,
                  margin: "auto",
                  display: "block",
                }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <ReserveDialog
        open={reserveOpen}
        onClose={() => setReserveOpen(false)}
        shop={shop}
      />
    </Box>
  );
};

export default ShopDetailPage;
