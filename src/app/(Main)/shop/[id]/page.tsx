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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { shopItems, shopReviews } from "@/mock/shop";
import ReserveDialog from "./ReserveDialog";
import getImageLayout from "./getImageLayout";

const ShopDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const shopId = Array.isArray(params.id) ? params.id[0] : params.id;
  const shop = shopItems.find((s) => s.id === shopId) || shopItems[0];
  const reviews = shopReviews.filter((r) =>
    r.author && r.author.id && shop.id === shopId ? true : true
  ); // 샘플: 전체 리뷰 노출

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [reserveOpen, setReserveOpen] = useState(false);

  const handleImgClick = (img: string) => {
    setModalImg(img);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setModalImg(null);
  };

  return (
    <Box maxWidth={1200} mx="auto" px={3} py={6}>
      <Stack direction="row" spacing={6} alignItems="flex-start">
        {/* 좌측: 이미지 + 식당 정보 */}
        <Box flex={2} minWidth={0}>
          {/* 상단: 이미지 */}
          <Box mb={4}>{getImageLayout(shop.thumbnailList, handleImgClick)}</Box>
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
                  {shop.name}
                </Typography>
                <Typography variant="h6" color="warning.main" fontWeight={600}>
                  ★ {shop.rating.toFixed(1)}
                </Typography>
              </Stack>
              <Box display="flex">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => setReserveOpen(true)}
                >
                  예약하기
                </Button>
              </Box>
            </Stack>
            <Typography variant="subtitle2" color="text.secondary" mb={1.5}>
              {shop.category}
            </Typography>
            <Typography variant="body1" mb={3}>
              {shop.description}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>
              {shop.address}
            </Typography>
            <Stack direction="row" spacing={4} mb={2}>
              <Typography variant="body2" color="text.secondary">
                영업시간: <b>{shop.businessHours}</b>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                연락처: <b>{shop.contact}</b>
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem />
        {/* 우측: 리뷰 리스트 */}
        <Box flex={1.5} minWidth={0}>
          <Box display="flex" alignItems="center" mb={2} gap={1}>
            <Typography variant="h5">리뷰</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {reviews.length}
            </Typography>
          </Box>
          <Box overflow="auto" pr={1}>
            <Stack spacing={2}>
              {reviews.map((review) => (
                <Box key={review.id} sx={{ p: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                    <Avatar
                      src={review.author.profileImage}
                      alt={review.author.nickname}
                    />
                    <Box>
                      <Typography fontWeight={600}>
                        {review.author.nickname}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString("ko-KR")}
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
                    {review.contents}
                  </Typography>
                  {review.imageList.length > 0 && (
                    <Box mb={1}>
                      {getImageLayout(review.imageList, handleImgClick)}
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
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
