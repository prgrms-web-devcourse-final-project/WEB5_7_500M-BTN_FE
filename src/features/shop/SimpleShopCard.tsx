import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { SimpleShop } from "@/mock/shop";

type SimpleShopCardProps = {
  shop: SimpleShop;
};

const SimpleShopCard = ({ shop }: SimpleShopCardProps) => {
  const router = useRouter();
  return (
    <Card>
      <CardActionArea onClick={() => router.push(`/shop/${shop.id}`)}>
        <CardMedia
          component="img"
          height="180"
          image={shop.thumbnail}
          alt={shop.name}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Typography variant="h6" fontWeight={600} noWrap>
            {shop.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {shop.address}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SimpleShopCard;
