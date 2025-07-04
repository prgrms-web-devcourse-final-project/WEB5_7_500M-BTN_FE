"use client";
import {
  Box,
  Stack,
  InputBase,
  Select,
  MenuItem,
  Paper,
  Divider,
} from "@mui/material";
import RestaurantListItemRow from "@/features/restaurant/RestaurantListCard";
import { restaurantListItems } from "@/mock/restaurant";

const mockRestaurants = restaurantListItems;

const categories = ["전체", "한식", "일식", "중식", "양식"] as const;
const sorts = ["근처순", "예약많은순", "평점순"] as const;

const RestaurantList: React.FC = () => {
  // TODO: 쿼리스트링 연동 및 상태 관리 구현
  return (
    <Box
      width={400}
      height="100vh"
      display="flex"
      flexDirection="column"
      borderRight={1}
      borderColor="#eee"
      bgcolor="#fafbfc"
    >
      {/* 검색 */}
      <Paper
        component="form"
        sx={{
          p: "2px 8px",
          display: "flex",
          alignItems: "center",
          borderRadius: 2,
          m: 2,
          boxShadow: 0,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="식당 검색"
          inputProps={{ "aria-label": "식당 검색" }}
        />
      </Paper>
      {/* 정렬/필터 */}
      <Stack direction="row" spacing={2} px={2} pb={2}>
        <Select
          size="small"
          fullWidth
          defaultValue={categories[0]}
          sx={{ bgcolor: "white", borderRadius: 1 }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
        <Select
          size="small"
          fullWidth
          defaultValue={sorts[0]}
          sx={{ bgcolor: "white", borderRadius: 1 }}
        >
          {sorts.map((sort) => (
            <MenuItem key={sort} value={sort}>
              {sort}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Divider />
      {/* 식당 리스트 */}
      <Box flex={1} overflow="auto" pb={2}>
        {mockRestaurants.map((restaurant) => (
          <RestaurantListItemRow key={restaurant.id} restaurant={restaurant} />
        ))}
      </Box>
    </Box>
  );
};

export default RestaurantList;
