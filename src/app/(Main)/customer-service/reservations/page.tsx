"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Container,
} from "@mui/material";
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import {
  useReservations,
  useConfirmReservation,
  useRefuseReservation,
  useOwnerShops,
} from "@/api/hooks";
import { useToast } from "@/features/common/Toast";
import Toast from "@/features/common/Toast";
import {
  GetReservationsFilterEnum,
  ReservationContent,
  OwnerShopItem,
} from "@/api/generated";

const statusColor: Record<string, "primary" | "success" | "error" | "warning"> =
  {
    CONFIRMED: "primary",
    COMPLETED: "success",
    CANCELLED: "error",
    PENDING: "warning",
    REFUSED: "error",
    TERMINATED: "error",
  };

const statusLabel: Record<string, string> = {
  CONFIRMED: "예약 완료",
  COMPLETED: "방문 완료",
  CANCELLED: "취소됨",
  PENDING: "대기중",
  REFUSED: "거절됨",
  TERMINATED: "종료됨",
};

const ReservationsPage = () => {
  const { toast, showToast, hideToast } = useToast();
  const [selectedShopId, setSelectedShopId] = useState<number | undefined>(
    undefined
  );
  const [selectedFilter, setSelectedFilter] =
    useState<GetReservationsFilterEnum>(GetReservationsFilterEnum.Pending);

  // 내 식당 목록 조회
  const {
    data: ownerShopsData,
    isLoading: shopsLoading,
    error: shopsError,
  } = useOwnerShops();

  // 예약 목록 조회
  const {
    data: reservationsData,
    isLoading: reservationsLoading,
    error: reservationsError,
    refetch,
  } = useReservations({
    filter: selectedFilter,
    size: 50,
    shopId: selectedShopId,
  });

  const confirmReservation = useConfirmReservation();
  const refuseReservation = useRefuseReservation();

  const shops = ownerShopsData?.data?.shopItem || [];
  const reservations = reservationsData?.content || [];

  const handleAccept = async (reservationId: number) => {
    try {
      await confirmReservation.mutateAsync(reservationId);
      showToast("예약이 수락되었습니다.", "success");
      refetch();
    } catch (error) {
      console.error("예약 수락 실패:", error);
      showToast("예약 수락에 실패했습니다.", "error");
    }
  };

  const handleReject = async (reservationId: number) => {
    try {
      await refuseReservation.mutateAsync(reservationId);
      showToast("예약이 거절되었습니다.", "success");
      refetch();
    } catch (error) {
      console.error("예약 거절 실패:", error);
      showToast("예약 거절에 실패했습니다.", "error");
    }
  };

  const handleShopChange = (shopId: number | undefined) => {
    setSelectedShopId(shopId);
  };

  const handleFilterChange = (filter: GetReservationsFilterEnum) => {
    setSelectedFilter(filter);
  };

  if (shopsLoading || reservationsLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (shopsError || reservationsError) {
    return (
      <Alert severity="error">
        예약 정보를 불러오는데 실패했습니다. 다시 시도해주세요.
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          예약현황
        </Typography>
        <Typography variant="body1" color="text.secondary">
          등록한 식당의 예약 현황을 관리할 수 있습니다.
        </Typography>
      </Box>

      {/* 필터 영역 */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>식당 선택</InputLabel>
                <Select
                  value={selectedShopId || ""}
                  onChange={(e) =>
                    handleShopChange((e.target.value as number) || undefined)
                  }
                  label="식당 선택"
                >
                  <MenuItem value="">전체 식당</MenuItem>
                  {shops.map((shop: OwnerShopItem) => (
                    <MenuItem key={shop.shopId} value={shop.shopId}>
                      {shop.shopName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>예약 상태</InputLabel>
                <Select
                  value={selectedFilter}
                  onChange={(e) =>
                    handleFilterChange(
                      e.target.value as GetReservationsFilterEnum
                    )
                  }
                  label="예약 상태"
                >
                  <MenuItem value={GetReservationsFilterEnum.Pending}>
                    대기중
                  </MenuItem>
                  <MenuItem value={GetReservationsFilterEnum.Confirmed}>
                    승인됨
                  </MenuItem>
                  <MenuItem value={GetReservationsFilterEnum.Cancelled}>
                    취소됨
                  </MenuItem>
                  <MenuItem value={GetReservationsFilterEnum.Refused}>
                    거절됨
                  </MenuItem>
                  <MenuItem value={GetReservationsFilterEnum.Terminated}>
                    종료됨
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 예약 목록 */}
      {reservations.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            해당 조건의 예약이 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary">
            다른 조건으로 검색해보세요.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  예약자
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  예약 일시
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  인원
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  연락처
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  요청사항
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  상태
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  액션
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation: ReservationContent) => (
                <TableRow
                  key={reservation.reservationId}
                  sx={{
                    "&:nth-of-type(even)": { background: "#fcfcfc" },
                    "&:hover": { background: "#f1f5f9" },
                    transition: "background 0.2s",
                  }}
                >
                  <TableCell align="center">
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={1}
                    >
                      <Avatar
                        src="/default-avatar.png"
                        alt="사용자"
                        sx={{ width: 32, height: 32 }}
                      />
                      <Typography fontWeight={600}>예약자</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Stack alignItems="center" spacing={0.5}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <TimeIcon fontSize="small" color="action" />
                        <Typography>{reservation.reservedAt}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                      }}
                    >
                      <PersonIcon fontSize="small" color="action" />
                      <Typography>{reservation.headCount}명</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                      }}
                    >
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography>{reservation.phoneNumber}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ maxWidth: 180, wordBreak: "break-all" }}
                  >
                    <span style={{ color: "#bbb" }}>-</span>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={
                        statusLabel[reservation.status || ""] ||
                        reservation.status
                      }
                      color={statusColor[reservation.status || ""] || "default"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {reservation.status === "PENDING" && (
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckIcon />}
                          onClick={() =>
                            handleAccept(reservation.reservationId!)
                          }
                          disabled={confirmReservation.isPending}
                        >
                          수락
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={() =>
                            handleReject(reservation.reservationId!)
                          }
                          disabled={refuseReservation.isPending}
                        >
                          거절
                        </Button>
                      </Stack>
                    )}
                    {reservation.status !== "PENDING" && (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Toast {...toast} onClose={hideToast} />
    </Container>
  );
};

export default ReservationsPage;
