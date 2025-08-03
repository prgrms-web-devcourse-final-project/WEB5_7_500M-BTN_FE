"use client";

import React, { useState, useEffect, useMemo } from "react";
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

import { ShopCreateDialog, ShopUpdateDialog } from "@/components/common";
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

const ProfileMyShopsTab = () => {
  const [key, setKey] = useState(Date.now());
  const router = useRouter();
  const { showToast, hideToast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [imageRetryCount, setImageRetryCount] = useState<{
    [key: number]: number;
  }>({});
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});

  const { data: ownerShopsData, isLoading, error, refetch } = useOwnerShops();

  const ownerShops = ownerShopsData?.data?.shopItem?.sort(
    (a, b) => (b.shopId ?? 0) - (a.shopId ?? 0)
  );

  const shops = ownerShops || [];

  const handleCreateShop = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditShop = (shopId: number) => {
    router.push(`/my-shop?shopId=${shopId}`);
  };

  const handleViewShop = (shopId: number) => {
    setSelectedShopId(shopId);
    setIsUpdateDialogOpen(true);
  };

  const handleShopCreateSuccess = () => {
    refetch();
    setKey(Date.now());
  };

  const handleShopUpdateSuccess = () => {
    refetch();
    setKey(Date.now());
  };

  const handleImageError = (shopId: number) => {
    const currentRetryCount = imageRetryCount[shopId] || 0;
    const maxRetries = 3;

    if (currentRetryCount < maxRetries) {
      const delay = Math.pow(2, currentRetryCount) * 1000; // 지수 백오프: 1초, 2초, 4초

      setTimeout(() => {
        setImageRetryCount((prev) => ({
          ...prev,
          [shopId]: currentRetryCount + 1,
        }));
        setImageError((prev) => ({
          ...prev,
          [shopId]: false,
        }));
      }, delay);
    } else {
      setImageError((prev) => ({
        ...prev,
        [shopId]: true,
      }));
    }
  };

  const handleImageLoad = (shopId: number) => {
    setImageError((prev) => ({
      ...prev,
      [shopId]: false,
    }));
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
    <>
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box></Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateShop}
            sx={{ borderRadius: 2 }}
          >
            식당 등록
          </Button>
        </Stack>

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
                    backgroundImage:
                      shop.thumbnailUrl && !imageError[shop.shopId!]
                        ? `url(${shop.thumbnailUrl})`
                        : "linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                    position: "relative",
                  }}
                >
                  {shop.thumbnailUrl && (
                    <img
                      src={`${shop.thumbnailUrl}?key=${key}`}
                      alt="thumbnail"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: imageError[shop.shopId!] ? "none" : "block",
                      }}
                      onError={() => handleImageError(shop.shopId!)}
                      onLoad={() => handleImageLoad(shop.shopId!)}
                    />
                  )}
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
                  </Stack>

                  {shop.approve === "APPROVED" && (
                    <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewShop(shop.shopId!)}
                        sx={{ flex: 1 }}
                      >
                        상세보기
                      </Button>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Stack>

      <ShopCreateDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleShopCreateSuccess}
      />

      {selectedShopId && (
        <ShopUpdateDialog
          open={isUpdateDialogOpen}
          onClose={() => {
            setIsUpdateDialogOpen(false);
            setSelectedShopId(null);
          }}
          onSuccess={handleShopUpdateSuccess}
          shopId={selectedShopId}
        />
      )}
    </>
  );
};

export default ProfileMyShopsTab;
