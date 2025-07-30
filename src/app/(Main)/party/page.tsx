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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PartyCardGrid from "@/features/party/PartyCardGrid";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import PartyCreateDialog from "./PartyCreateDialog";
import { useParties } from "@/api/hooks";
import { GetPartiesStatusEnum, GetPartiesGenderEnum } from "@/api/generated";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/features/common/Toast";

dayjs.locale("ko");

const peopleOptions = ["전체", 2, 3, 4, 5, 6, 7, 8, 9, 10];
const currentPeopleOptions = ["전체", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const PartyExploreListPage = () => {
  const [search, setSearch] = useState("");
  const [maxPeople, setMaxPeople] = useState<string | number>("전체");
  const [currentPeople, setCurrentPeople] = useState<string | number>("전체");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // 필터 초기화 함수
  const handleResetFilters = () => {
    setSearch("");
    setMaxPeople("전체");
    setCurrentPeople("전체");
    setSelectedDate(null);
  };

  // 필터가 적용되어 있는지 확인
  const hasActiveFilters =
    search.trim() ||
    maxPeople !== "전체" ||
    currentPeople !== "전체" ||
    selectedDate !== null;

  // API 파라미터 구성 - 모든 필터링을 클라이언트 사이드에서 처리
  const apiParams = useMemo(() => {
    return {
      size: 50, // 더 많은 데이터를 가져와서 클라이언트에서 필터링
    };
  }, []);

  const { data: partiesData, isLoading, error } = useParties(apiParams);
  const parties = partiesData?.data?.content || [];

  // 클라이언트 사이드 필터링 (모든 조건을 AND로 연결)
  const filteredParties = useMemo(() => {
    let filtered = parties;

    // 검색어 필터링
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((party) => {
        return (
          party.title?.toLowerCase().includes(searchLower) ||
          party.shopName?.toLowerCase().includes(searchLower) ||
          party.shopRoadAddress?.toLowerCase().includes(searchLower) ||
          party.shopDetailAddress?.toLowerCase().includes(searchLower)
        );
      });
    }

    // 전체 인원 필터링
    if (maxPeople !== "전체") {
      filtered = filtered.filter((party) => {
        return party.maxCount === Number(maxPeople);
      });
    }

    // 현재 인원 필터링
    if (currentPeople !== "전체") {
      filtered = filtered.filter((party) => {
        return party.currentCount === Number(currentPeople);
      });
    }

    // 날짜 필터링 (출발 날짜 기준)
    if (selectedDate) {
      const selectedDateStr = selectedDate.format("YYYY-MM-DD");
      filtered = filtered.filter((party) => {
        const partyDate = dayjs(party.metAt).format("YYYY-MM-DD");
        return partyDate === selectedDateStr;
      });
    }

    return filtered;
  }, [parties, search, maxPeople, currentPeople, selectedDate]);

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

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <Stack
          direction="row"
          spacing={2}
          mb={4}
          flexWrap="wrap"
          gap={2}
          alignItems="flex-end"
        >
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
            <InputLabel>전체 인원</InputLabel>
            <Select
              value={maxPeople}
              label="전체 인원"
              onChange={(e) => setMaxPeople(e.target.value)}
            >
              {peopleOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>현재 인원</InputLabel>
            <Select
              value={currentPeople}
              label="현재 인원"
              onChange={(e) => setCurrentPeople(e.target.value)}
            >
              {currentPeopleOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DatePicker
            label="출발 날짜"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            slotProps={{
              textField: {
                sx: { minWidth: 160 },
                InputLabelProps: { shrink: true },
              },
            }}
          />
          {hasActiveFilters && (
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleResetFilters}
              sx={{ minWidth: 100 }}
            >
              초기화
            </Button>
          )}
        </Stack>
      </LocalizationProvider>

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
