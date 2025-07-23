import React from "react";
import { Card, CardContent, Typography, Stack, Chip } from "@mui/material";
import Link from "next/link";
import dayjs from "dayjs";
import type { PartyListResponse } from "@/api/generated";

interface SimplePartyCardProps {
  party: PartyListResponse;
}

const SimplePartyCard = ({ party }: SimplePartyCardProps) => {
  const currentCount = party.currentCount || 0;
  const minCount = party.minCount || 0;
  const maxCount = party.maxCount || 0;

  return (
    <Card sx={{ p: 2, height: "100%" }}>
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
          <Typography variant="body2" color="text.secondary">
            {currentCount}명 / {maxCount}명 (최소 {minCount}명)
          </Typography>
        </Stack>
        <Link
          href={`/party/${party.partyId}`}
          style={{ textDecoration: "none", marginTop: "auto" }}
        >
          <Chip label="상세보기" color="primary" sx={{ cursor: "pointer" }} />
        </Link>
      </CardContent>
    </Card>
  );
};

export default SimplePartyCard;
