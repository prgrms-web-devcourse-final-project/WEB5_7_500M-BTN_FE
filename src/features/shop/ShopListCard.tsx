import { Box, Stack, Typography, Avatar, IconButton } from "@mui/material";
import type { ShopsItem } from "@/api/generated";
import Link from "next/link";
import { getCategoryLabel } from "@/constants";
import { useRouter } from "next/navigation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface ShopListItemRowProps {
  shop: ShopsItem;
  isSelected?: boolean;
  onClick?: () => void;
}

const ShopListItemRow: React.FC<ShopListItemRowProps> = ({
  shop,
  isSelected = false,
  onClick,
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/shop/${shop.shopId}`);
  };

  return (
    <Link href={`/shop/${shop.shopId}`}>
      <Box
        p={2}
        borderBottom={1}
        borderColor="#f0f0f0"
        sx={{
          backgroundColor: isSelected
            ? "rgba(25, 118, 210, 0.08)"
            : "transparent",
          borderLeft: isSelected ? 3 : 0,
          borderLeftColor: "primary.main",
          "&:hover": {
            transition: "all 0.2s",
            backgroundColor: isSelected
              ? "rgba(25, 118, 210, 0.12)"
              : "rgba(0, 0, 0, 0.04)",
            cursor: "pointer",
          },
        }}
        onClick={handleClick}
      >
        <Box flex={1} minWidth={0}>
          <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {shop.shopName}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {getCategoryLabel(shop.category || "")}
            </Typography>
            <Typography variant="body2" color="warning.main" fontWeight={600}>
              ★ {shop.rating?.toFixed(1) || "0.0"}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              size="small"
              onClick={handleDetailClick}
              sx={{
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                },
              }}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {shop.roadAddress}
            </Typography>
          </Stack>
        </Box>
        <Box mt={1} display="flex" justifyContent="flex-start">
          <Avatar
            variant="rounded"
            src={shop.thumbnailUrl}
            alt={shop.shopName}
            sx={{ width: "100%", height: 160, borderRadius: 1 }}
          />
        </Box>
      </Box>
    </Link>
  );
};

export default ShopListItemRow;
