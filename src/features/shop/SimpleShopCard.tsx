import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ShopsItem } from "@/api/generated";

type SimpleShopCardProps = {
  shop: ShopsItem;
};

const SimpleShopCard = ({ shop }: SimpleShopCardProps) => {
  const router = useRouter();
  return (
    <Card>
      <CardActionArea onClick={() => router.push(`/shop/${shop.shopId}`)}>
        <CardMedia
          component="img"
          height="180"
          image={shop.thumbnailUrl || ""}
          alt={shop.shopName || ""}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Typography variant="h6" fontWeight={600} noWrap>
            {shop.shopName}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {shop.roadAddress}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SimpleShopCard;
