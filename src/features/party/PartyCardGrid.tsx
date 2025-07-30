import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Chip,
  Box,
} from "@mui/material";
import Link from "next/link";
import dayjs from "dayjs";
import type { PartyListResponse } from "@/api/generated";
import GroupIcon from "@mui/icons-material/Group";

interface PartyCardGridProps {
  party: PartyListResponse;
}

const PartyCardGrid = ({ party }: PartyCardGridProps) => {
  return (
    <Link href={`/party/${party.partyId}`} style={{ textDecoration: "none" }}>
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
          image={party.shopImage || "/default-shop-image.jpg"}
          alt={party.shopName}
          sx={{ objectFit: "cover" }}
        />
        <CardContent
          sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6" fontWeight={700} noWrap>
            {party.title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" noWrap>
            {party.shopName}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {party.shopRoadAddress}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Chip
              label={dayjs(party.metAt).format("M월 D일 ddd A h:mm")}
              size="small"
            />
            <Chip
              icon={<GroupIcon />}
              label={`${party.currentCount}/${party.maxCount}명`}
              size="small"
              color={
                party.currentCount === party.maxCount ? "error" : "default"
              }
            />
          </Stack>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PartyCardGrid;
