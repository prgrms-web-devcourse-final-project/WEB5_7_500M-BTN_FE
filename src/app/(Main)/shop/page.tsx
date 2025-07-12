import { Box } from "@mui/material";
import ShopList from "./ShopList";
import ShopMap from "./ShopMap";

const ShopPage: React.FC = () => {
  return (
    <Box display="flex" width="100vw" height="100vh">
      <ShopList />
      <Box flex={1}>
        <ShopMap />
      </Box>
    </Box>
  );
};

export default ShopPage;
