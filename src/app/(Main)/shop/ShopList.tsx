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
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ShopListItemRow from "@/features/shop/ShopListCard";
import { useShops } from "@/api/hooks";
import { GetShopsCategoryEnum, ShopsItem } from "@/api/generated";
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

interface ShopListProps {
  onShopSelect?: (shop: ShopsItem) => void;
  onShopsDataUpdate?: (shops: ShopsItem[]) => void;
}

const ShopList: React.FC<ShopListProps> = ({
  onShopSelect,
  onShopsDataUpdate,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearchQuery = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "NEAR";
  const initialCategory = searchParams.get("category") || "ALL";

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<
    GetShopsCategoryEnum | "ALL"
  >(initialCategory as GetShopsCategoryEnum | "ALL");
  const [selectedSort, setSelectedSort] = useState<string>(initialSort);
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    useState(initialSearchQuery);
  const [selectedShop, setSelectedShop] = useState<ShopsItem | null>(null);

  // URL 파라미터 변경 시 상태 업데이트
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    const sortFromUrl = searchParams.get("sort") || "NEAR";
    const categoryFromUrl = searchParams.get("category") || "ALL";

    setSearchQuery(searchFromUrl);
    setDebouncedSearchQuery(searchFromUrl);
    setSelectedSort(sortFromUrl);
    setSelectedCategory(categoryFromUrl as GetShopsCategoryEnum | "ALL");
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

  const {
    data: shopsData,
    isLoading,
    error,
  } = useShops({
    latitude: 37.5724, // 종로구 기본 좌표
    longitude: 126.9794, // 종로구 기본 좌표
    radius: 3000, // 3km 반경
    size: 20,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: any) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);

    // URL 업데이트
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory === "ALL") {
      params.delete("category");
    } else {
      params.set("category", newCategory);
    }
    router.replace(`/shop?${params.toString()}`);
  };

  const handleSortChange = (e: any) => {
    const newSort = e.target.value;
    setSelectedSort(newSort);

    // URL 업데이트
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === "NEAR") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }
    router.replace(`/shop?${params.toString()}`);
  };

  const handleShopSelect = useCallback(
    (shop: ShopsItem) => {
      setSelectedShop(shop);
      if (onShopSelect) {
        onShopSelect(shop);
      }
    },
    [onShopSelect]
  );

  // 검색어와 카테고리로 필터링 및 정렬 (클라이언트 사이드) - useMemo로 최적화
  const filteredAndSortedShops = useMemo(() => {
    let filtered =
      shopsData?.data?.content?.filter((shop) => {
        // 검색어 필터링
        const matchesSearch =
          !debouncedSearchQuery ||
          shop.shopName
            ?.toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          shop.roadAddress
            ?.toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase());

        // 카테고리 필터링
        const matchesCategory =
          selectedCategory === "ALL" || shop.category === selectedCategory;

        return matchesSearch && matchesCategory;
      }) || [];

    // 정렬 적용
    switch (selectedSort) {
      case "RATING":
        filtered = [...filtered].sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA; // 높은 평점순
        });
        break;
      case "RESERVATION_COUNT":
        // 예약 많은순은 현재 API에서 제공하지 않으므로 기본 순서 유지
        // 추후 API에서 reservationCount 필드가 추가되면 정렬 로직 구현
        break;
      case "NEAR":
      default:
        // 근처순은 API에서 이미 정렬된 상태로 받아옴
        break;
    }

    return filtered;
  }, [
    shopsData?.data?.content,
    debouncedSearchQuery,
    selectedSort,
    selectedCategory,
  ]);

  // 필터링된 식당 데이터가 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    if (onShopsDataUpdate && filteredAndSortedShops.length > 0) {
      onShopsDataUpdate(filteredAndSortedShops);
    }
  }, [filteredAndSortedShops, onShopsDataUpdate]);

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
        ) : filteredAndSortedShops.length === 0 ? (
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
          filteredAndSortedShops.map((shop: ShopsItem) => (
            <ShopListItemRow
              key={shop.shopId}
              shop={shop}
              isSelected={selectedShop?.shopId === shop.shopId}
              onClick={() => handleShopSelect(shop)}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default ShopList;
