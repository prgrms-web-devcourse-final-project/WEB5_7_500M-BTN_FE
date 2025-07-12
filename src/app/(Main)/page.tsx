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
        px={12}
        pb={12}
        sx={{ maxWidth: 1200, mx: "auto" }}
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <ShopList />
        <PartyList />
      </Box>
    </Box>
  );
}
