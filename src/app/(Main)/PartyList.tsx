"use client";

import { Box, Stack, Typography, Grid, CircularProgress } from "@mui/material";
import SimplePartyCard from "@/features/party/SimplePartyCard";
import { useParties } from "@/api/hooks";
import dayjs from "dayjs";
import "dayjs/locale/ko";

const PartyList = () => {
  dayjs.locale("ko");
  const { data: partiesData, isLoading, error } = useParties({ size: 6 });

  if (isLoading) {
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !partiesData?.data?.content) {
    return (
      <Box mt={4}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          맛집 원정대
        </Typography>
        <Typography color="text.secondary">
          파티 정보를 불러올 수 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Stack direction="row" alignItems="flex-end" mb={3} gap={0.5}>
        <Typography variant="h5" fontWeight={700}>
          맛집 원정대
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" ml={1}>
          맛잘알즈와 함께하는 재밌는 식사!
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        {partiesData.data.content.map((party) => (
          <Grid key={party.partyId} size={{ xs: 12, sm: 6, md: 4 }}>
            <SimplePartyCard party={party} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PartyList;
