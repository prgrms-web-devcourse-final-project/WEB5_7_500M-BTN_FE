import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  CardActionArea,
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import type { PartyListResponse } from "@/api/generated";
import GroupIcon from "@mui/icons-material/Group";

interface SimplePartyCardProps {
  party: PartyListResponse;
}

const SimplePartyCard = ({ party }: SimplePartyCardProps) => {
  const router = useRouter();
  const currentCount = party.currentCount || 0;
  const minCount = party.minCount || 0;
  const maxCount = party.maxCount || 0;
  const isFull = currentCount === maxCount;

  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea onClick={() => router.push(`/party/${party.partyId}`)}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            pb: "16px !important",
          }}
        >
          <Typography variant="h6" fontWeight={600} noWrap mb={1}>
            {party.title}
          </Typography>
          <Stack spacing={0.5} mb={2}>
            <Typography variant="subtitle1" fontWeight={500}>
              {party.shopName}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {party.shopRoadAddress}
            </Typography>
          </Stack>
          <Stack spacing={0.5} mb={2}>
            <Typography variant="subtitle1" fontWeight={500}>
              탐험 시간
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dayjs(party.metAt).format("YYYY년 MM월 DD일 dddd A h:mm")}
            </Typography>
          </Stack>
          <Stack spacing={0.5} mb={2}>
            <Typography variant="subtitle1" fontWeight={500}>
              모집 인원
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {currentCount}명 / {maxCount}명
              </Typography>
              {isFull && (
                <Chip
                  label="마감"
                  size="small"
                  color="error"
                  variant="outlined"
                />
              )}
            </Stack>
            {minCount > 0 && (
              <Typography variant="caption" color="text.secondary">
                최소 {minCount}명 필요
              </Typography>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SimplePartyCard;
