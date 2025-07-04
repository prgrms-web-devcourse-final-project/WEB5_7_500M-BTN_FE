import { Box, Stack, Typography, Avatar } from "@mui/material";
import type { RestaurantListItem } from "@/mock/restaurant";

interface RestaurantListItemRowProps {
  restaurant: RestaurantListItem;
}

const RestaurantListItemRow: React.FC<RestaurantListItemRowProps> = ({
  restaurant,
}) => {
  return (
    <Box
      p={2}
      borderBottom={1}
      borderColor="#f0f0f0"
      sx={{
        "&:hover": {
          transition: "all 0.2s",
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          cursor: "pointer",
        },
      }}
    >
      <Box flex={1} minWidth={0}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {restaurant.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {restaurant.category}
            </Typography>
          </Stack>
          <Typography variant="body2" color="warning.main" fontWeight={600}>
            ★ {restaurant.rating.toFixed(1)}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {restaurant.address}
          </Typography>
        </Stack>
      </Box>
      <Box mt={1} display="flex" justifyContent="flex-start">
        <Avatar
          variant="rounded"
          src={restaurant.thumbnail}
          alt={restaurant.name}
          sx={{ width: "100%", height: 160, borderRadius: 1 }}
        />
      </Box>
    </Box>
  );
};

export default RestaurantListItemRow;
