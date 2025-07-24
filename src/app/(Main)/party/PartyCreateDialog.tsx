import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Button,
  TextField,
  Grid,
  Paper,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  DateTimePicker,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import ShopMap from "../shop/ShopMap";
import { useCreateParty, useShopsBySearch } from "@/api/hooks";
import { useToast } from "@/features/common/Toast";
import type {
  PartyCreateRequest,
  ShopElementResponse,
  ShopsItem,
} from "@/api/generated";
import { getCategoryLabel } from "@/constants";

// window.kakao 타입 선언 (ShopMap.tsx 참고)
declare global {
  interface Window {
    kakao: unknown;
  }
}

const KAKAO_API_KEY = "c1ae6914a310b40050898f16a0aebb5f";

interface PartyCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: any) => void;
}

const PartyCreateDialog: React.FC<PartyCreateDialogProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const createPartyMutation = useCreateParty();
  const { showToast } = useToast();

  // 폼 상태
  const [title, setTitle] = useState("");
  const [metAt, setMetAt] = useState<Dayjs | null>(dayjs());
  const [minCount, setMinCount] = useState(2);
  const [maxCount, setMaxCount] = useState(5);
  const [selectedShop, setSelectedShop] = useState<ShopElementResponse | null>(
    null
  );
  const [prevSelectedShop, setPrevSelectedShop] =
    useState<ShopElementResponse | null>(null);
  const [deadline, setDeadline] = useState<Dayjs | null>(dayjs());
  const [genderCondition, setGenderCondition] = useState<string>("A");
  const [minAge, setMinAge] = useState<number | undefined>(undefined);
  const [maxAge, setMaxAge] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState("");

  // 모드 상태: false=기본(생성폼), true=식당검색
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 검색 관련 상태
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<ShopElementResponse[]>([]);

  // API 검색 훅
  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
  } = useShopsBySearch({
    query: keyword,
    size: 20,
  });

  // 검색 결과가 변경될 때마다 searchResults 업데이트
  useEffect(() => {
    if (searchData?.data?.shops) {
      setSearchResults(searchData.data.shops);
    } else {
      setSearchResults([]);
    }
  }, [searchData]);

  // 검색 결과를 메모이제이션하여 불필요한 재렌더링 방지
  const memoizedSearchResults = useMemo(() => {
    return searchResults;
  }, [searchResults]);

  // ShopMap에서 사용할 ShopsItem 형태로 변환
  const shopsForMap = useMemo(() => {
    return memoizedSearchResults.map(
      (shop): ShopsItem => ({
        shopId: shop.shopId,
        shopName: shop.name,
        category: shop.category,
        roadAddress: shop.address,
        detailAddress: "",
        latitude: 37.566826, // 기본값 (실제로는 주소 검색으로 얻어야 함)
        longitude: 126.9786567, // 기본값
        rating: shop.rating,
        thumbnailUrl: shop.thumbnailUrl,
      })
    );
  }, [memoizedSearchResults]);

  // 파티 생성
  const handleCreate = async () => {
    if (!title || !metAt || !selectedShop || !deadline) {
      showToast("필수 정보를 모두 입력해주세요.", "error");
      return;
    }

    try {
      const partyData: PartyCreateRequest = {
        title,
        shopId: selectedShop.shopId!, // API의 shopId 사용
        metAt: metAt.toISOString(),
        deadline: deadline.toISOString(),
        genderCondition: genderCondition as "W" | "M" | "A",
        minAge,
        maxAge,
        minCount,
        maxCount,
        description: description || undefined,
      };

      await createPartyMutation.mutateAsync(partyData);
      showToast("파티가 성공적으로 생성되었습니다!", "success");
      onCreate?.(partyData);
      onClose();
    } catch (error) {
      // 에러는 이미 useCreateParty 훅에서 자동으로 처리됨
    }
  };

  // 다이얼로그 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setTitle("");
      setMetAt(dayjs());
      setMinCount(2);
      setMaxCount(5);
      setSelectedShop(null);
      setKeyword("");
      setSearchResults([]);
      setIsSearchMode(false); // 모드도 초기화
      setGenderCondition("A");
      setMinAge(undefined);
      setMaxAge(undefined);
      setDescription("");
    }
    // eslint-disable-next-line
  }, [open]);

  // 검색 버튼 클릭 시 검색 실행
  const handleSearch = () => {
    setSelectedShop(null); // 검색 시 선택 초기화
  };

  // API 검색 결과를 받아옴 (더 이상 사용하지 않음)
  const handleSearchResults = useCallback((results: any[]) => {
    // API 검색으로 대체되었으므로 사용하지 않음
  }, []);

  // 검색 모드 진입 시 이전 선택값 저장
  const handleEnterSearchMode = () => {
    setPrevSelectedShop(selectedShop);
    setIsSearchMode(true);
  };
  // 뒤로가기(검색모드 종료) 시 이전 선택값 복원
  const handleBackFromSearch = () => {
    setSelectedShop(prevSelectedShop);
    setIsSearchMode(false);
  };
  // 선택 완료 시 현재 선택값을 prevSelectedShop에 반영하고 모드 종료
  const handleSelectComplete = () => {
    setPrevSelectedShop(selectedShop);
    setIsSearchMode(false);
  };

  // ShopMap에서 식당 선택 시 호출되는 함수
  const handleShopSelectFromMap = useCallback((shop: ShopsItem) => {
    // ShopsItem을 ShopElementResponse로 변환
    const selectedShopElement: ShopElementResponse = {
      shopId: shop.shopId,
      name: shop.shopName,
      category: shop.category,
      address: shop.roadAddress,
      rating: shop.rating,
      thumbnailUrl: shop.thumbnailUrl,
    };
    setSelectedShop(selectedShopElement);
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isSearchMode ? "lg" : "sm"}
      fullWidth
    >
      <DialogContent
        sx={{
          p: 0,
          position: "relative",
          minHeight: isSearchMode ? "90vh" : undefined,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
        >
          <CloseIcon />
        </IconButton>
        {/* 모드 분기 */}
        {!isSearchMode ? (
          // 기본 모드: 파티 생성 폼만
          <Box p={4} minWidth={360}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              파티 생성
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="파티 제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
              />
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="ko"
              >
                <DateTimePicker
                  label="모임 날짜/시간"
                  value={metAt}
                  onChange={setMetAt}
                  disablePast
                  sx={{ width: "100%" }}
                />
                <DatePicker
                  label="모집 마감일자"
                  value={deadline}
                  onChange={setDeadline}
                  disablePast
                  sx={{ width: "100%", mt: 1 }}
                />
              </LocalizationProvider>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel>모집 성별</InputLabel>
                <Select
                  value={genderCondition}
                  label="모집 성별"
                  onChange={(e) => setGenderCondition(e.target.value)}
                >
                  <MenuItem value="A">무관</MenuItem>
                  <MenuItem value="M">남성</MenuItem>
                  <MenuItem value="W">여성</MenuItem>
                </Select>
              </FormControl>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="최소 나이"
                  type="number"
                  value={minAge || ""}
                  onChange={(e) =>
                    setMinAge(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  inputProps={{ min: 1, max: 100 }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="최대 나이"
                  type="number"
                  value={maxAge || ""}
                  onChange={(e) =>
                    setMaxAge(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  inputProps={{ min: 1, max: 100 }}
                  sx={{ flex: 1 }}
                />
              </Stack>
              <TextField
                label="파티 설명"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                maxRows={6}
                sx={{ mt: 1 }}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="최소 인원"
                  type="number"
                  value={minCount}
                  onChange={(e) => setMinCount(Number(e.target.value))}
                  inputProps={{ min: 2, max: maxCount }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="최대 인원"
                  type="number"
                  value={maxCount}
                  onChange={(e) => setMaxCount(Number(e.target.value))}
                  inputProps={{ min: minCount, max: 20 }}
                  sx={{ flex: 1 }}
                />
              </Stack>
              {/* 선택된 식당 요약 */}
              {selectedShop && (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f5faff" }}>
                  <Stack alignItems="flex-start">
                    <Typography fontWeight={700} fontSize={16} mb={0.5}>
                      {selectedShop.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      {selectedShop.address}
                    </Typography>
                  </Stack>
                </Paper>
              )}
              <Button
                variant="outlined"
                color="primary"
                onClick={handleEnterSearchMode}
                sx={{ mt: 1 }}
              >
                식당 검색
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={
                  !title ||
                  !metAt ||
                  !selectedShop ||
                  !deadline ||
                  createPartyMutation.isPending
                }
                onClick={handleCreate}
                sx={{ mt: 2 }}
              >
                {createPartyMutation.isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "파티 생성하기"
                )}
              </Button>
            </Stack>
          </Box>
        ) : (
          // 식당 검색 모드
          <Grid container>
            {/* 왼쪽: 검색+리스트 */}
            <Grid
              size={{ xs: 12, md: 5 }}
              sx={{
                p: 4,
                borderRight: { md: "1px solid #eee" },
                height: "90vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack direction="row" spacing={1} mb={2}>
                <TextField
                  label="식당 키워드 검색"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  fullWidth
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={handleSearch}
                  disabled={isSearchLoading}
                >
                  검색
                </Button>
              </Stack>
              {/* 검색 결과 리스트: 결과 있을 때만 */}
              {searchResults.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    width: "100%",
                    overflow: "auto",
                    mb: 2,
                    bgcolor: "transparent",
                    boxShadow: "none",
                    border: "none",
                    borderRadius: 0,
                    p: 0,
                  }}
                >
                  <Stack spacing={0}>
                    {searchResults.map((place) => (
                      <Button
                        key={place.shopId}
                        sx={{
                          justifyContent: "flex-start",
                          textAlign: "left",
                          alignItems: "flex-start",
                          borderBottom: "1px solid #eee",
                          borderRadius: 0,
                          bgcolor:
                            selectedShop?.shopId === place.shopId
                              ? "#e3f2fd"
                              : undefined,
                          py: 1.5,
                          px: 1.5,
                          gap: 1,
                          minHeight: 0,
                          boxShadow: "none",
                        }}
                        onClick={() => {
                          setSelectedShop(place);
                        }}
                      >
                        <Stack
                          spacing={0.5}
                          alignItems="flex-start"
                          width="100%"
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                            width="100%"
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Typography fontWeight={700} noWrap>
                                {place.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap
                              >
                                {getCategoryLabel(place.category || "")}
                              </Typography>
                            </Stack>
                            <Typography
                              variant="body2"
                              color="warning.main"
                              fontWeight={600}
                            >
                              ★ {place.rating?.toFixed(1) || "0.0"}
                            </Typography>
                          </Stack>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {place.address}
                          </Typography>
                          <Box mt={1} display="flex" sx={{ width: "100%" }}>
                            <Avatar
                              variant="rounded"
                              src={place.thumbnailUrl}
                              alt={place.name}
                              sx={{
                                width: "100%",
                                height: 120,
                                borderRadius: 1,
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                        </Stack>
                      </Button>
                    ))}
                  </Stack>
                </Paper>
              )}

              {/* 검색 결과가 없을 때 */}
              {keyword && searchResults.length === 0 && !isSearchLoading && (
                <Box p={2}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    검색 결과가 없습니다.
                  </Typography>
                </Box>
              )}

              {/* 로딩 중 */}
              {isSearchLoading && (
                <Box p={2} display="flex" justifyContent="center">
                  <CircularProgress size={24} />
                </Box>
              )}

              <Box flex={1} />
              <Stack direction="row" spacing={1} mt={2}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleBackFromSearch}
                  fullWidth
                >
                  뒤로가기
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!selectedShop}
                  onClick={handleSelectComplete}
                >
                  선택 완료
                </Button>
              </Stack>
            </Grid>
            {/* 오른쪽: 지도만 표시 */}
            <Grid size={{ xs: 12, md: 7 }} sx={{ p: 0 }}>
              <ShopMap
                shops={shopsForMap}
                selectedShopId={selectedShop?.shopId}
                onShopSelect={handleShopSelectFromMap}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PartyCreateDialog;
