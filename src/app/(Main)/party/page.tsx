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
  CircularProgress,
  Alert,
} from "@mui/material";
import PartyCardGrid from "@/features/party/PartyCardGrid";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import PartyCreateDialog from "./PartyCreateDialog";
import { useParties } from "@/api/hooks";
import { GetPartiesStatusEnum, GetPartiesGenderEnum } from "@/api/generated";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/features/common/Toast";

dayjs.locale("ko");

const peopleOptions = ["전체", 2, 3, 4, 5];

const PartyExploreListPage = () => {
  const [search, setSearch] = useState("");
  const [people, setPeople] = useState<string | number>("전체");
  const [date, setDate] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // API 파라미터 구성
  const apiParams = useMemo(() => {
    const params: any = {
      size: 20,
    };

    if (search) {
      params.query = search;
    }

    if (people !== "전체") {
      params.maxCount = Number(people);
    }

    if (date) {
      // 날짜 필터링은 클라이언트 사이드에서 처리
    }

    return params;
  }, [search, people, date]);

  const { data: partiesData, isLoading, error } = useParties(apiParams);
  const parties = partiesData?.data?.content || [];

  // 날짜 필터링 (클라이언트 사이드)
  const filteredParties = useMemo(() => {
    if (!date) return parties;

    return parties.filter((party) => {
      const partyDate = dayjs(party.metAt).format("YYYY-MM-DD");
      return partyDate === date;
    });
  }, [parties, date]);

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
          onClick={() => {
            if (!isAuthenticated) {
              showToast("로그인이 필요합니다.", "warning");
              return;
            }
            setCreateOpen(true);
          }}
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

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          파티 정보를 불러오는데 실패했습니다.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredParties.map((party) => (
              <Grid key={party.partyId} size={{ xs: 12, sm: 6, md: 4 }}>
                <PartyCardGrid party={party} />
              </Grid>
            ))}
          </Grid>
          {filteredParties.length === 0 && (
            <Typography color="text.secondary" mt={6} textAlign="center">
              조건에 맞는 파티가 없습니다.
            </Typography>
          )}
        </>
      )}

      <PartyCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </Box>
  );
};

export default PartyExploreListPage;
