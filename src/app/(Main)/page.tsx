import { Box } from "@mui/material";
import Banner from "./Banner";
import ShopList from "./ShopList";
import PartyList from "./PartyList";

export default function Home() {
  return (
    <Box>
      {/* 배너 영역 */}
      <Banner />
      <Box
        px={{ xs: 2, sm: 4, md: 6, lg: 12 }}
        pb={{ xs: 6, sm: 8, md: 10, lg: 12 }}
        sx={{ maxWidth: 1200, mx: "auto" }}
        display="flex"
        flexDirection="column"
        gap={{ xs: 3, sm: 4 }}
      >
        <ShopList />
        <PartyList />
      </Box>
    </Box>
  );
}
