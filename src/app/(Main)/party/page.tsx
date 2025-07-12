"use client";
import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { simpleParties } from "@/mock/party";
import PartyCardGrid from "@/features/party/PartyCardGrid";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import PartyCreateDialog from "./PartyCreateDialog";

dayjs.locale("ko");

const peopleOptions = ["전체", 2, 3, 4, 5];

const PartyExploreListPage = () => {
  const [search, setSearch] = useState("");
  const [people, setPeople] = useState<string | number>("전체");
  const [date, setDate] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const filteredParties = useMemo(() => {
    return simpleParties.filter((party) => {
      const matchSearch =
        party.name.includes(search) ||
        party.shop.name.includes(search) ||
        party.shop.address.includes(search);
      const matchPeople =
        people === "전체" || party.maxUserCount === Number(people);
      const matchDate =
        !date || dayjs(party.dateTime).format("YYYY-MM-DD") === date;
      return matchSearch && matchPeople && matchDate;
    });
  }, [search, people, date]);

  return (
    <Box maxWidth={1200} mx="auto" px={3} py={6}>
      <Stack direction="row" alignItems="flex-end" mb={3} gap={0.5}>
        <Typography variant="h4" fontWeight={700}>
          맛집 탐험 파티
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" ml={1}>
          맛잘알즈와 함께하는 재밌는 식사!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ ml: "auto", mb: 0.5 }}
          onClick={() => setCreateOpen(true)}
        >
          파티 생성
        </Button>
      </Stack>
      <Stack direction="row" spacing={2} mb={4}>
        <TextField
          placeholder="파티명, 식당명, 주소 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 240 }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>인원</InputLabel>
          <Select
            value={people}
            label="인원"
            onChange={(e) => setPeople(e.target.value)}
          >
            {peopleOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="date"
          label="날짜"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 160 }}
        />
      </Stack>
      <Grid container spacing={3}>
        {filteredParties.map((party) => (
          <Grid key={party.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <PartyCardGrid party={party} />
          </Grid>
        ))}
      </Grid>
      {filteredParties.length === 0 && (
        <Typography color="text.secondary" mt={6} textAlign="center">
          조건에 맞는 파티가 없습니다.
        </Typography>
      )}
      <PartyCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </Box>
  );
};

export default PartyExploreListPage;
