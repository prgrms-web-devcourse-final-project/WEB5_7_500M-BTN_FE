import { Box, Stack, Typography, Avatar } from "@mui/material";
import type { ShopListItem } from "@/mock/shop";
import Link from "next/link";

interface ShopListItemRowProps {
  shop: ShopListItem;
}

const ShopListItemRow: React.FC<ShopListItemRowProps> = ({ shop }) => {
  return (
    <Link href={`/shop/${shop.id}`}>
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
                {shop.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {shop.category}
              </Typography>
            </Stack>
            <Typography variant="body2" color="warning.main" fontWeight={600}>
              ★ {shop.rating.toFixed(1)}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {shop.address}
            </Typography>
          </Stack>
        </Box>
        <Box mt={1} display="flex" justifyContent="flex-start">
          <Avatar
            variant="rounded"
            src={shop.thumbnail}
            alt={shop.name}
            sx={{ width: "100%", height: 160, borderRadius: 1 }}
          />
        </Box>
      </Box>
    </Link>
  );
};

export default ShopListItemRow;
