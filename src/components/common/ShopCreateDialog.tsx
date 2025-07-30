"use client";
import React, { useRef, useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useCreateShop } from "@/api/hooks";
import { useToast } from "@/features/common/Toast";
import { ShopCreateRequestCategoryEnum } from "@/api/generated";
import KakaoMap from "@/app/(Main)/party/KakaoMap";
import { getCategoryLabel } from "@/constants";

// window.kakao 타입 선언
declare global {
  interface Window {
    kakao: unknown;
  }
}

interface KakaoPlace {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  x: string;
  y: string;
  category_name?: string;
  place_url?: string;
}

interface ShopCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ShopCreateDialog = ({
  open,
  onClose,
  onSuccess,
}: ShopCreateDialogProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    roadAddress: "",
    detailAddress: "",
    sido: "",
    latitude: 0,
    longitude: 0,
    businessCode: "",
    category: "" as ShopCreateRequestCategoryEnum,
    tel: "",
    description: "",
    reservationFee: 0,
    openTime: "09:00:00",
    closeTime: "23:00:00",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast, hideToast } = useToast();

  // 카카오맵 관련 상태
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<KakaoPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null);
  const [searchTrigger, setSearchTrigger] = useState(0);

  const createShopMutation = useCreateShop();

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      showToast("최대 5장까지 업로드할 수 있습니다.", "warning");
      return;
    }
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((newImgs) => setImages([...images, ...newImgs]));
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  // 카카오맵 검색 관련 함수들
  const handleSearch = () => {
    setSelectedPlace(null);
    setSearchTrigger((prev) => prev + 1);
  };

  const handleSearchResults = useCallback((results: any[]) => {
    setSearchResults(results);
  }, []);

  const handlePlaceSelect = (place: KakaoPlace) => {
    setSelectedPlace(place);
    // 주소에서 시/도 추출 (예: "서울특별시 강남구" -> "서울특별시")
    const addressParts = place.road_address_name.split(" ");
    const sido = addressParts[0] || "";

    setFormData({
      ...formData,
      shopName: place.place_name,
      roadAddress: place.road_address_name,
      latitude: Number(place.y),
      longitude: Number(place.x),
      sido: sido,
      tel: place.phone || "",
    });
  };

  const handleMapDialogClose = () => {
    setShowMapDialog(false);
    setKeyword("");
    setSearchResults([]);
    setSelectedPlace(null);
  };

  const handleCreateShop = async () => {
    if (
      !formData.shopName ||
      !formData.roadAddress ||
      !formData.category ||
      !formData.latitude ||
      !formData.longitude
    ) {
      showToast("필수 정보를 모두 입력해주세요.", "error");
      return;
    }

    try {
      // 식당 생성 API 호출
      const response = await createShopMutation.mutateAsync({
        shopName: formData.shopName,
        roadAddress: formData.roadAddress,
        detailAddress: formData.detailAddress,
        sido: formData.sido,
        latitude: formData.latitude,
        longitude: formData.longitude,
        businessCode: formData.businessCode,
        category: formData.category,
        reservationFee: formData.reservationFee,
        openTime: formData.openTime,
        closeTime: formData.closeTime,
        description: formData.description,
        tel: formData.tel,
        imageCount: images.length,
      });

      // presigned URL을 사용해서 이미지 업로드
      if (response.data?.data?.items && images.length > 0) {
        const uploadPromises = response.data.data.items.map(
          async (item, index) => {
            if (index < images.length && item.url) {
              const imageData = images[index];

              // base64 데이터를 Blob으로 변환
              const base64Response = await fetch(imageData);
              const blob = await base64Response.blob();

              // presigned URL로 이미지 업로드
              // API 문서에 따르면 Cache-Control 헤더가 필요함
              const uploadResponse = await fetch(item.url, {
                method: "PUT",
                body: blob,
                headers: {
                  "Content-Type": blob.type || "image/jpeg",
                  "Cache-Control": "no-cache,no-store,must-revalidate",
                },
              });

              if (!uploadResponse.ok) {
                throw new Error(
                  `이미지 업로드 실패: ${uploadResponse.statusText}`
                );
              }
            }
          }
        );

        try {
          await Promise.all(uploadPromises);
          showToast("식당과 이미지가 성공적으로 업로드되었습니다.", "success");
        } catch (uploadError) {
          console.error("이미지 업로드 실패:", uploadError);
          showToast(
            "식당은 생성되었지만 이미지 업로드에 실패했습니다.",
            "warning"
          );
        }
      } else {
        showToast("식당이 성공적으로 생성되었습니다.", "success");
      }

      // 폼 초기화
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error("식당 생성 실패:", error);
      showToast("식당 생성에 실패했습니다.", "error");
    }
  };

  const handleClose = () => {
    setFormData({
      shopName: "",
      roadAddress: "",
      detailAddress: "",
      sido: "",
      latitude: 0,
      longitude: 0,
      businessCode: "",
      category: "" as ShopCreateRequestCategoryEnum,
      tel: "",
      description: "",
      reservationFee: 0,
      openTime: "09:00:00",
      closeTime: "23:00:00",
    });
    setImages([]);
    setSelectedPlace(null);
    setSearchResults([]);
    setKeyword("");
    onClose();
  };

  // KakaoMap에 넘길 값들 useMemo로 최적화
  const mapCenter = useMemo(
    () =>
      selectedPlace
        ? { lat: Number(selectedPlace.y), lng: Number(selectedPlace.x) }
        : undefined,
    [selectedPlace]
  );
  const mapMarker = useMemo(
    () =>
      selectedPlace
        ? { lat: Number(selectedPlace.y), lng: Number(selectedPlace.x) }
        : undefined,
    [selectedPlace]
  );
  const mapMarkers = useMemo(
    () =>
      selectedPlace
        ? [{ lat: Number(selectedPlace.y), lng: Number(selectedPlace.x) }]
        : searchResults.map((place) => ({
            lat: Number(place.y),
            lng: Number(place.x),
          })),
    [selectedPlace, searchResults]
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { maxHeight: "90vh" },
        }}
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={700}>
              새 식당 등록
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={3}>
              <TextField
                fullWidth
                label="식당명"
                value={formData.shopName}
                onChange={(e) =>
                  setFormData({ ...formData, shopName: e.target.value })
                }
                required
              />
              <FormControl fullWidth required>
                <InputLabel>카테고리</InputLabel>
                <Select
                  value={formData.category}
                  label="카테고리"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as ShopCreateRequestCategoryEnum,
                    })
                  }
                >
                  <MenuItem value={ShopCreateRequestCategoryEnum.Korean}>
                    한식
                  </MenuItem>
                  <MenuItem value={ShopCreateRequestCategoryEnum.Japanese}>
                    일식
                  </MenuItem>
                  <MenuItem value={ShopCreateRequestCategoryEnum.Chinese}>
                    중식
                  </MenuItem>
                  <MenuItem value={ShopCreateRequestCategoryEnum.Western}>
                    양식
                  </MenuItem>
                  <MenuItem value={ShopCreateRequestCategoryEnum.Chicken}>
                    치킨
                  </MenuItem>
                  <MenuItem value={ShopCreateRequestCategoryEnum.Pizza}>
                    피자
                  </MenuItem>
                  <MenuItem value={ShopCreateRequestCategoryEnum.Fastfood}>
                    패스트푸드
                  </MenuItem>
                  <MenuItem value={ShopCreateRequestCategoryEnum.StewSoup}>
                    찌개/국물
                  </MenuItem>
                  <MenuItem value={ShopCreateRequestCategoryEnum.JokBo}>
                    족발/보쌈
                  </MenuItem>
                  <MenuItem value={ShopCreateRequestCategoryEnum.Snack}>
                    분식
                  </MenuItem>
                  <MenuItem value={ShopCreateRequestCategoryEnum.Dessert}>
                    디저트
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* 주소 검색 버튼 */}
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={() => setShowMapDialog(true)}
              sx={{ alignSelf: "flex-start" }}
            >
              카카오맵에서 식당 찾기
            </Button>

            {/* 선택된 주소 정보 표시 */}
            {formData.roadAddress && (
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="subtitle2" fontWeight={700} mb={1}>
                  선택된 주소 정보
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>식당명:</strong> {formData.shopName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>도로명 주소:</strong> {formData.roadAddress}
                  </Typography>
                  <Typography variant="body2">
                    <strong>위도/경도:</strong> {formData.latitude},{" "}
                    {formData.longitude}
                  </Typography>
                  {formData.tel && (
                    <Typography variant="body2">
                      <strong>전화번호:</strong> {formData.tel}
                    </Typography>
                  )}
                </Stack>
              </Paper>
            )}

            <TextField
              fullWidth
              label="상세 주소"
              value={formData.detailAddress}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  detailAddress: e.target.value,
                })
              }
              placeholder="건물명, 층수 등 상세 주소를 입력하세요"
            />

            <Stack direction="row" spacing={3}>
              <TextField
                fullWidth
                label="사업자 등록번호"
                value={formData.businessCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    businessCode: e.target.value,
                  })
                }
                required
                placeholder="000-00-00000"
              />
              <TextField
                fullWidth
                label="전화번호"
                value={formData.tel}
                onChange={(e) =>
                  setFormData({ ...formData, tel: e.target.value })
                }
                placeholder="카카오맵에서 자동으로 가져오거나 수동 입력"
              />
            </Stack>

            <Stack direction="row" spacing={3}>
              <TextField
                fullWidth
                label="영업 시작 시간"
                type="time"
                value={formData.openTime}
                onChange={(e) =>
                  setFormData({ ...formData, openTime: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="영업 종료 시간"
                type="time"
                value={formData.closeTime}
                onChange={(e) =>
                  setFormData({ ...formData, closeTime: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="예약금"
                type="number"
                value={formData.reservationFee}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reservationFee: Number(e.target.value),
                  })
                }
                InputProps={{
                  endAdornment: <Typography variant="caption">원</Typography>,
                }}
              />
            </Stack>

            <TextField
              fullWidth
              label="식당 설명"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="식당에 대한 간단한 설명을 입력하세요"
            />

            {/* 이미지 업로드 */}
            <Box>
              <Typography variant="h6" fontWeight={700} mb={2}>
                식당 이미지 (최대 5장)
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-start"
                flexWrap="wrap"
              >
                {images.map((img, idx) => (
                  <Box
                    key={idx}
                    position="relative"
                    sx={{
                      overflow: "hidden",
                      width: 100,
                      height: 100,
                      "&:hover .remove-btn": { opacity: 1 },
                    }}
                  >
                    <Box
                      component="img"
                      src={img}
                      alt={`shop-img-${idx}`}
                      sx={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      className="remove-btn"
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "rgba(255,255,255,0.8)",
                        opacity: 0,
                        transition: "opacity 0.2s",
                      }}
                      onClick={() => handleRemoveImage(idx)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                {images.length < 5 && (
                  <Box>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      ref={fileInputRef}
                      onChange={handleAddImage}
                    />
                    <Tooltip title="사진 추가">
                      <Button
                        variant="outlined"
                        color="primary"
                        sx={{
                          width: 100,
                          height: 100,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          fontWeight: 700,
                        }}
                        startIcon={
                          <AddPhotoAlternateIcon sx={{ fontSize: 32 }} />
                        }
                        onClick={() => fileInputRef.current?.click()}
                      >
                        추가
                      </Button>
                    </Tooltip>
                  </Box>
                )}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button
            variant="contained"
            onClick={handleCreateShop}
            disabled={createShopMutation.isPending}
          >
            {createShopMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              "식당 등록"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 카카오맵 다이얼로그 */}
      <Dialog
        open={showMapDialog}
        onClose={handleMapDialogClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: "relative", minHeight: "90vh" }}>
          <IconButton
            onClick={handleMapDialogClose}
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
          >
            <CloseIcon />
          </IconButton>

          <Grid container sx={{ height: "90vh" }}>
            {/* 왼쪽: 검색 및 결과 */}
            <Grid size={{ xs: 12, md: 5 }} sx={{ p: 3, overflow: "auto" }}>
              <Typography variant="h6" fontWeight={700} mb={3}>
                식당 검색
              </Typography>

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="식당명 또는 주소로 검색"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                  fullWidth
                >
                  검색
                </Button>
              </Stack>

              {searchResults.length > 0 && (
                <Paper sx={{ mt: 3, p: 2, maxHeight: 400, overflow: "auto" }}>
                  <Typography variant="subtitle2" fontWeight={700} mb={2}>
                    검색 결과 ({searchResults.length}개)
                  </Typography>
                  <Stack spacing={1}>
                    {searchResults.map((place) => (
                      <Button
                        key={place.id}
                        variant="text"
                        sx={{
                          textAlign: "left",
                          justifyContent: "flex-start",
                          p: 2,
                          border: selectedPlace?.id === place.id ? 2 : 1,
                          borderColor:
                            selectedPlace?.id === place.id
                              ? "primary.main"
                              : "grey.300",
                          bgcolor:
                            selectedPlace?.id === place.id
                              ? "primary.50"
                              : "transparent",
                        }}
                        onClick={() => handlePlaceSelect(place)}
                      >
                        <Stack spacing={0.5} alignItems="flex-start">
                          <Typography fontWeight={700}>
                            {place.place_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {place.road_address_name || place.address_name}
                          </Typography>
                          {place.phone && (
                            <Typography variant="body2" color="text.secondary">
                              전화번호: {place.phone}
                            </Typography>
                          )}
                          {place.category_name && (
                            <Typography variant="body2" color="text.secondary">
                              카테고리: {place.category_name}
                            </Typography>
                          )}
                          {place.place_url && (
                            <Button
                              href={place.place_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              sx={{
                                minWidth: 0,
                                p: 0,
                                color: "primary.main",
                                textTransform: "none",
                                display: "flex",
                                alignItems: "center",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <OpenInNewIcon
                                fontSize="small"
                                sx={{ mr: 0.5 }}
                              />
                              <Typography variant="caption">상세</Typography>
                            </Button>
                          )}
                        </Stack>
                      </Button>
                    ))}
                  </Stack>
                </Paper>
              )}

              <Box flex={1} />
              <Stack direction="row" spacing={1} mt={2}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleMapDialogClose}
                  fullWidth
                >
                  취소
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!selectedPlace}
                  onClick={handleMapDialogClose}
                >
                  선택 완료
                </Button>
              </Stack>
            </Grid>

            {/* 오른쪽: 지도만 표시 */}
            <Grid size={{ xs: 12, md: 7 }} sx={{ p: 0 }}>
              <KakaoMap
                center={mapCenter}
                marker={mapMarker}
                markers={mapMarkers}
                zoomLevel={selectedPlace ? 1 : 3}
                keyword={searchTrigger > 0 ? keyword : undefined}
                onSearchResults={handleSearchResults}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShopCreateDialog;
