import React from "react";
import { Stack, Typography } from "@mui/material";
import PartyItem from "./PartyItem";
import { simpleParties } from "@/mock/party";

const joinedParties = simpleParties.filter((p) => p.currentUserCount > 0);
// 날짜 내림차순(최신순) 정렬
const sortedParties = [...joinedParties].sort(
  (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
);

const ProfilePartiesTab = () => (
  <Stack spacing={2}>
    {sortedParties.length === 0 && (
      <Typography color="text.secondary">참여한 파티가 없습니다.</Typography>
    )}
    {sortedParties.map((party) => (
      <PartyItem key={party.id} party={party} />
    ))}
  </Stack>
);

export default ProfilePartiesTab;
