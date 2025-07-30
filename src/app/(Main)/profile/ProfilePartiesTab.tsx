import React from "react";
import { Stack, Typography, CircularProgress, Alert, Box } from "@mui/material";
import PartyItem from "./PartyItem";
import { useMyParties } from "@/api/hooks";

const ProfilePartiesTab = () => {
  const { data: myPartiesData, isLoading, error } = useMyParties();
  const myParties = myPartiesData?.data?.content || [];

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        내 파티 정보를 불러오는데 실패했습니다. 다시 시도해주세요.
      </Alert>
    );
  }

  return (
    <Stack spacing={2}>
      {myParties.length === 0 && (
        <Typography color="text.secondary">참여한 파티가 없습니다.</Typography>
      )}
      {myParties.map((party) => (
        <PartyItem key={party.partyId} party={party} />
      ))}
    </Stack>
  );
};

export default ProfilePartiesTab;
