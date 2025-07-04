import { Box } from "@mui/material";
import RestaurantList from "./RestaurantList";
import RestaurantMap from "./RestaurantMap";

const RestaurantPage: React.FC = () => {
  return (
    <Box display="flex" width="100vw" height="100vh">
      <RestaurantList />
      <Box flex={1}>
        <RestaurantMap />
      </Box>
    </Box>
  );
};

export default RestaurantPage;
