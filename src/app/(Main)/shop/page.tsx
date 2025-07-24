"use client";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Suspense, useState, useCallback } from "react";
import ShopList from "./ShopList";
import ShopMap from "./ShopMap";
import { ShopsItem } from "@/api/generated";

const ShopPage: React.FC = () => {
  const [selectedShop, setSelectedShop] = useState<ShopsItem | null>(null);
  const [shopsData, setShopsData] = useState<ShopsItem[]>([]);

  const handleShopSelect = useCallback((shop: ShopsItem) => {
    setSelectedShop(shop);
  }, []);

  const handleShopsDataUpdate = useCallback((shops: ShopsItem[]) => {
    setShopsData(shops);
  }, []);

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
        />
      </Suspense>
      <Box flex={1}>
        <ShopMap
          shops={shopsData}
          selectedShopId={selectedShop?.shopId}
          onShopSelect={handleShopSelect}
        />
      </Box>
    </Box>
  );
};

export default ShopPage;
