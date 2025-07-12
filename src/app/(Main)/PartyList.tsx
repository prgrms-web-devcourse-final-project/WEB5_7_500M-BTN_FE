"use client";

import { Box, Stack, Typography, Grid } from "@mui/material";
import { simpleParties } from "@/mock/party";
import SimplePartyCard from "@/features/party/SimplePartyCard";
import dayjs from "dayjs";
import "dayjs/locale/ko";

const PartyList = () => {
  dayjs.locale("ko");
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
        {simpleParties.map((party) => (
          <Grid key={party.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <SimplePartyCard party={party} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PartyList;
