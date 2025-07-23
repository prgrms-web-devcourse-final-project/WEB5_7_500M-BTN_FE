import { Box, CircularProgress, Typography } from "@mui/material";
import { Suspense } from "react";
import ShopList from "./ShopList";
import ShopMap from "./ShopMap";

const ShopPage: React.FC = () => {
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
        <ShopList />
      </Suspense>
      <Box flex={1}>
        <ShopMap />
      </Box>
    </Box>
  );
};

export default ShopPage;
