"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Container,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useOwnerShops } from "@/api/hooks";
import { useToast } from "@/features/common/Toast";
import Toast from "@/features/common/Toast";
import { ShopCreateDialog } from "@/components/common";
import {
  OwnerShopItem,
  OwnerShopItemCategoryEnum,
  OwnerShopItemApproveEnum,
} from "@/api/generated";
import { getCategoryLabel } from "@/constants";

const getStatusColor = (status: OwnerShopItemApproveEnum) => {
  switch (status) {
    case "APPROVED":
      return "success";
    case "PENDING":
      return "warning";
    case "REJECTED":
      return "error";
    default:
      return "default";
  }
};

const getStatusText = (status: OwnerShopItemApproveEnum) => {
  switch (status) {
    case "APPROVED":
      return "승인됨";
    case "PENDING":
      return "승인 대기";
    case "REJECTED":
      return "거절됨";
    default:
      return "알 수 없음";
  }
};

const MyShopsPage = () => {
  const router = useRouter();
  const { showToast, hideToast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: ownerShopsData, isLoading, error, refetch } = useOwnerShops();

  const shops = ownerShopsData?.data?.shopItem || [];

  const handleCreateShop = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditShop = (shopId: number) => {
    router.push(`/my-shop?shopId=${shopId}`);
  };

  const handleViewShop = (shopId: number) => {
    router.push(`/shop/${shopId}`);
  };

  const handleShopCreateSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        식당 정보를 불러오는데 실패했습니다. 다시 시도해주세요.
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            내 식당 목록
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateShop}
            sx={{ borderRadius: 2 }}
          >
            식당 등록
          </Button>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          등록한 식당들을 관리하고 예약 현황을 확인할 수 있습니다.
        </Typography>
      </Box>

      {shops.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            등록된 식당이 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            첫 번째 식당을 등록해보세요!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateShop}
          >
            식당 등록하기
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {shops.map((shop: OwnerShopItem) => (
            <Card
              key={shop.shopId}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                },
              }}
            >
              <Box
                sx={{
                  height: 200,
                  backgroundImage: shop.thumbnailUrl
                    ? `url(${shop.thumbnailUrl})`
                    : "linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                  position: "relative",
                }}
              >
                <img
                  src={shop.thumbnailUrl}
                  alt="thumbnail"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <Chip
                  label={getStatusText(shop.approve || "PENDING")}
                  color={getStatusColor(shop.approve || "PENDING")}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                  }}
                />
              </Box>
              <CardContent
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                <Typography variant="h6" component="h2" gutterBottom>
                  {shop.shopName}
                </Typography>

                <Stack spacing={1} sx={{ mb: 2, flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CategoryIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {getCategoryLabel(shop.category || "KOREAN")}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {shop.roadAddress}
                    </Typography>
                  </Box>

                  {shop.rating && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <StarIcon fontSize="small" color="warning" />
                      <Typography variant="body2" color="text.secondary">
                        {shop.rating.toFixed(1)}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewShop(shop.shopId!)}
                    sx={{ flex: 1 }}
                  >
                    상세보기
                  </Button>
                  <Tooltip title="식당 정보 수정">
                    <IconButton
                      size="small"
                      onClick={() => handleEditShop(shop.shopId!)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <ShopCreateDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleShopCreateSuccess}
      />

      <Toast showToast={showToast} hideToast={hideToast} />
    </Container>
  );
};

export default MyShopsPage;
