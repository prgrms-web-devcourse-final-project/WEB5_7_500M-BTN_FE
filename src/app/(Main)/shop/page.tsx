"use client";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Suspense, useState, useCallback } from "react";
import ShopList from "./ShopList";
import ShopMap from "./ShopMap";
import { ShopsItem } from "@/api/generated";
import useGeolocation from "@/hooks/useGeolocation";

const ShopPage: React.FC = () => {
  const [selectedShop, setSelectedShop] = useState<ShopsItem | null>(null);
  const [shopsData, setShopsData] = useState<ShopsItem[]>([]);
  const [reSearchHandler, setReSearchHandler] = useState<
    ((center: { latitude: number; longitude: number }) => void) | null
  >(null);
  const { location: userLocation } = useGeolocation();

  const handleShopSelect = useCallback((shop: ShopsItem) => {
    setSelectedShop(shop);
  }, []);

  const handleShopsDataUpdate = useCallback((shops: ShopsItem[]) => {
    setShopsData(shops);
  }, []);

  const handleReSearch = useCallback(
    (handler: (center: { latitude: number; longitude: number }) => void) => {
      setReSearchHandler(() => handler);
    },
    []
  );

  const handleMapReSearch = useCallback(
    (center: { latitude: number; longitude: number }) => {
      if (reSearchHandler) {
        reSearchHandler(center);
      }
    },
    [reSearchHandler]
  );

  return (
    <Box display="flex" width="100vw" height="100vh">
      <Suspense
        fallback={
          <Box
            sx={{
              width: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography>로딩 중...</Typography>
          </Box>
        }
      >
        <ShopList
          onShopSelect={handleShopSelect}
          onShopsDataUpdate={handleShopsDataUpdate}
          onReSearch={handleReSearch}
        />
      </Suspense>
      <Box flex={1}>
        <ShopMap
          shops={shopsData}
          selectedShopId={selectedShop?.shopId}
          onShopSelect={handleShopSelect}
          userLocation={userLocation}
          onReSearch={handleMapReSearch}
        />
      </Box>
    </Box>
  );
};

export default ShopPage;
