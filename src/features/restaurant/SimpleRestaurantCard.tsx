import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { SimpleRestaurant } from "@/mock/restaurant";

type SimpleRestaurantCardProps = {
  restaurant: SimpleRestaurant;
};

const SimpleRestaurantCard = ({ restaurant }: SimpleRestaurantCardProps) => {
  const router = useRouter();
  return (
    <Card>
      <CardActionArea
        onClick={() => router.push(`/restaurant/${restaurant.id}`)}
      >
        <CardMedia
          component="img"
          height="180"
          image={restaurant.thumbnail}
          alt={restaurant.name}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Typography variant="h6" fontWeight={600} noWrap>
            {restaurant.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {restaurant.address}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SimpleRestaurantCard;
