"use client";

import { Box, Grid, Typography, Stack } from "@mui/material";
import SimpleRestaurantCard from "@/features/restaurant/SimpleRestaurantCard";
import { simpleRestaurants } from "@/mock/restaurant";

const RestaurantList = () => {
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
        {simpleRestaurants.slice(0, 6).map((restaurant) => (
          <Grid key={restaurant.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <SimpleRestaurantCard restaurant={restaurant} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RestaurantList;
