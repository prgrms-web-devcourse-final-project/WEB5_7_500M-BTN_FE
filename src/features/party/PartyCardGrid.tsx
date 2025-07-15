import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Stack,
  Chip,
} from "@mui/material";
import { SimpleParty } from "@/mock/party";
import dayjs from "dayjs";
import Link from "next/link";

interface PartyCardGridProps {
  party: SimpleParty;
}

const PartyCardGrid = ({ party }: PartyCardGridProps) => {
  return (
    <Link href={`/party/${party.id}`} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image={party.shop.thumbnail}
          alt={party.shop.name}
          sx={{ objectFit: "cover" }}
        />
        <CardContent
          sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6" fontWeight={700} noWrap>
            {party.name}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" noWrap>
            {party.shop.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {party.shop.address}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Chip label={dayjs(party.dateTime).format("M월 D일 ddd A h:mm")} />
            <Chip
              label={`인원: ${party.currentUserCount}/${party.maxUserCount}`}
            />
          </Stack>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PartyCardGrid;
