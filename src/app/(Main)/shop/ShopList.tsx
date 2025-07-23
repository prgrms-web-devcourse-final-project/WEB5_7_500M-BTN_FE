"use client";
import {
  Box,
  Stack,
  InputBase,
  Select,
  MenuItem,
  Paper,
  Divider,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ShopListItemRow from "@/features/shop/ShopListCard";
import { useShops } from "@/api/hooks";
import { GetShopsCategoryEnum } from "@/api/generated";
import { SEARCH_CONSTANTS } from "@/constants";
import { debounce } from "@/utils";

const categories = [
  { value: "ALL", label: "전체" },
  { value: "KOREAN", label: "한식" },
  { value: "JAPANESE", label: "일식" },
  { value: "CHINESE", label: "중식" },
  { value: "WESTERN", label: "양식" },
] as const;

const sorts = [
  { value: "NEAR", label: "근처순" },
  { value: "RESERVATION_COUNT", label: "예약많은순" },
  { value: "RATING", label: "평점순" },
] as const;

const ShopList: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearchQuery = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<
    GetShopsCategoryEnum | "ALL"
  >("ALL");
  const [selectedSort, setSelectedSort] = useState<string>("NEAR");
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    useState(initialSearchQuery);

  // URL 파라미터 변경 시 검색어 업데이트
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setSearchQuery(searchFromUrl);
    setDebouncedSearchQuery(searchFromUrl);
  }, [searchParams]);

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      // URL 업데이트
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      } else {
        params.delete("search");
      }
      router.replace(`/shop?${params.toString()}`);
    }, SEARCH_CONSTANTS.SEARCH_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery, router, searchParams]);

  // API 호출을 위한 파라미터 설정
  const categoryFilter =
    selectedCategory === "ALL"
      ? undefined
      : [selectedCategory as GetShopsCategoryEnum];

  const {
    data: shopsData,
    isLoading,
    error,
  } = useShops({
    category: categoryFilter,
    sort: selectedSort,
    size: 20,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: any) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e: any) => {
    setSelectedSort(e.target.value);
  };

  // 검색어로 필터링 (클라이언트 사이드)
  const filteredShops =
    shopsData?.data?.content?.filter((shop) => {
      if (!debouncedSearchQuery) return true;
      return (
        shop.shopName
          ?.toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        shop.roadAddress
          ?.toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase())
      );
    }) || [];

  return (
    <Box
      width={400}
      height="100vh"
      display="flex"
      flexDirection="column"
      borderRight={1}
      borderColor="#eee"
      bgcolor="#fafbfc"
    >
      {/* 검색 */}
      <Paper
        component="form"
        sx={{
          p: "2px 8px",
          display: "flex",
          alignItems: "center",
          borderRadius: 2,
          m: 2,
          boxShadow: 0,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="식당 검색"
          value={searchQuery}
          onChange={handleSearchChange}
          inputProps={{ "aria-label": "식당 검색" }}
        />
      </Paper>

      {/* 정렬/필터 */}
      <Stack direction="row" spacing={2} px={2} pb={2}>
        <Select
          size="small"
          fullWidth
          value={selectedCategory}
          onChange={handleCategoryChange}
          sx={{ bgcolor: "white", borderRadius: 1 }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.value} value={cat.value}>
              {cat.label}
            </MenuItem>
          ))}
        </Select>
        <Select
          size="small"
          fullWidth
          value={selectedSort}
          onChange={handleSortChange}
          sx={{ bgcolor: "white", borderRadius: 1 }}
        >
          {sorts.map((sort) => (
            <MenuItem key={sort.value} value={sort.value}>
              {sort.label}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Divider />

      {/* 식당 리스트 */}
      <Box flex={1} overflow="auto" pb={2}>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box p={2}>
            <Alert severity="error">식당 목록을 불러오는데 실패했습니다.</Alert>
          </Box>
        ) : filteredShops.length === 0 ? (
          <Box p={2}>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              {debouncedSearchQuery
                ? "검색 결과가 없습니다."
                : "등록된 식당이 없습니다."}
            </Typography>
          </Box>
        ) : (
          filteredShops.map((shop) => (
            <ShopListItemRow key={shop.shopId} shop={shop} />
          ))
        )}
      </Box>
    </Box>
  );
};

export default ShopList;
