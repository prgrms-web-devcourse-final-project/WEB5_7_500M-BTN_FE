"use client";

import { Box, Grid, Typography, Stack, CircularProgress } from "@mui/material";
import SimpleShopCard from "@/features/shop/SimpleShopCard";
import { useShops } from "@/api/hooks";

const ShopList = () => {
  const {
    data: shopsData,
    isLoading,
    error,
  } = useShops({
    latitude: 37.5724, // 종로구 기본 좌표
    longitude: 126.9794, // 종로구 기본 좌표
    radius: 3000, // 3km 반경
    size: 6,
  });

  if (isLoading) {
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !shopsData?.data?.content) {
    return (
      <Box mt={4}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          근처 맛집
        </Typography>
        <Typography color="text.secondary">
          맛집 정보를 불러올 수 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Stack direction="row" alignItems="flex-end" mb={3} gap={0.5}>
        <Typography variant="h5" fontWeight={700}>
          근처 맛집
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" ml={1}>
          맛잘알즈가 엄선한 내 주변 인기 맛집!
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        {shopsData.data.content.map((shop) => (
          <Grid key={shop.shopId} size={{ xs: 12, sm: 6, md: 4 }}>
            <SimpleShopCard shop={shop} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ShopList;
