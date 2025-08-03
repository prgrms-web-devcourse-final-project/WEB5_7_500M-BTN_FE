"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Star as StarIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import {
  useOwnerShops,
  useReservations,
  useConfirmReservation,
  useRefuseReservation,
} from "@/api/hooks";
import { useToast } from "@/features/common/Toast";
import {
  OwnerShopItem,
  OwnerShopItemCategoryEnum,
  OwnerShopItemApproveEnum,
  GetReservationsFilterEnum,
  ReservationContent,
} from "@/api/generated";
import { getCategoryLabel } from "@/constants";
import dayjs from "dayjs";

const getStatusColor = (status: OwnerShopItemApproveEnum) => {
  switch (status) {
    case "APPROVED":
      return "success";
    case "PENDING":
      return "warning";
    case "REJECTED":
      return "error";
    default:
      return "default";
  }
};

const getStatusText = (status: OwnerShopItemApproveEnum) => {
  switch (status) {
    case "APPROVED":
      return "승인됨";
    case "PENDING":
      return "승인 대기";
    case "REJECTED":
      return "거절됨";
    default:
      return "알 수 없음";
  }
};

const reservationStatusColor: Record<
  string,
  "primary" | "success" | "error" | "warning"
> = {
  CONFIRMED: "primary",
  COMPLETED: "success",
  CANCELLED: "error",
  PENDING: "warning",
  REFUSED: "error",
  TERMINATED: "error",
};

const reservationStatusLabel: Record<string, string> = {
  CONFIRMED: "예약 완료",
  COMPLETED: "방문 완료",
  CANCELLED: "취소됨",
  PENDING: "대기중",
  REFUSED: "거절됨",
  TERMINATED: "종료됨",
};

const ProfileMyShopsReservationTab = () => {
  const router = useRouter();
  const { showToast, hideToast } = useToast();

  const {
    data: ownerShopsData,
    isLoading: shopsLoading,
    error: shopsError,
  } = useOwnerShops();
  const {
    data: reservationsData,
    isLoading: reservationsLoading,
    error: reservationsError,
  } = useReservations({
    size: 50,
  });

  // 예약 수락/거절 훅
  const confirmReservation = useConfirmReservation();
  const refuseReservation = useRefuseReservation();

  const ownerShops = ownerShopsData?.data?.shopItem?.sort(
    (a, b) => (b.shopId ?? 0) - (a.shopId ?? 0)
  );

  const shops = ownerShops || [];
  const reservations =
    ((reservationsData as any)?.data?.content as ReservationContent[]) || [];

  // 예약에 해당하는 식당 정보를 찾는 함수
  const getShopInfo = (shopName: string) => {
    return shops.find((shop) => shop.shopName === shopName);
  };

  const handleViewShop = (shopId: number) => {
    router.push(`/shop/${shopId}`);
  };

  // 예약 수락 처리
  const handleConfirmReservation = async (reservationId: number) => {
    try {
      await confirmReservation.mutateAsync(reservationId);
      showToast("예약이 수락되었습니다.", "success");
    } catch (error) {
      showToast("예약 수락에 실패했습니다.", "error");
    }
  };

  // 예약 거절 처리
  const handleRefuseReservation = async (reservationId: number) => {
    try {
      await refuseReservation.mutateAsync(reservationId);
      showToast("예약이 거절되었습니다.", "success");
    } catch (error) {
      showToast("예약 거절에 실패했습니다.", "error");
    }
  };

  if (shopsLoading) {
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

  if (shopsError) {
    return (
      <Alert severity="error">
        식당 정보를 불러오는데 실패했습니다. 다시 시도해주세요.
      </Alert>
    );
  }

  return (
    <>
      <Stack spacing={3}>
        <Typography variant="h6" fontWeight={600}>
          나의 식당 예약 현황
        </Typography>

        {shops.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              등록된 식당이 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary">
              식당을 등록하면 예약 현황을 확인할 수 있습니다.
            </Typography>
          </Box>
        ) : (
          <Box>
            {reservationsLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : reservationsError ? (
              <Alert severity="error">
                예약 정보를 불러오는데 실패했습니다.
              </Alert>
            ) : reservations.length === 0 ? (
              <Alert severity="info">현재 대기중인 예약이 없습니다.</Alert>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: "#f8fafc" }}>
                      <TableCell align="center">식당명</TableCell>
                      <TableCell align="center">일시</TableCell>
                      <TableCell align="center">인원</TableCell>
                      <TableCell align="center">연락처</TableCell>
                      <TableCell align="center">상태</TableCell>
                      <TableCell align="center" width={180}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reservations.map((reservation: ReservationContent) => {
                      return (
                        <TableRow
                          key={reservation.reservationId}
                          sx={{
                            "&:nth-of-type(even)": { background: "#fcfcfc" },
                            "&:hover": { background: "#f1f5f9" },
                            transition: "background 0.2s",
                          }}
                        >
                          <TableCell align="center">
                            <Stack spacing={1}>
                              <Typography
                                fontWeight={600}
                                sx={{
                                  cursor: "pointer",
                                  color: "primary.main",
                                  "&:hover": { textDecoration: "underline" },
                                }}
                                onClick={() => {
                                  const shopInfo = getShopInfo(
                                    reservation.shopName!
                                  );
                                  if (shopInfo?.shopId) {
                                    handleViewShop(shopInfo.shopId);
                                  }
                                }}
                              >
                                {reservation.shopName || "알 수 없는 식당"}
                              </Typography>
                              {/* {getShopInfo(reservation.shopName!) && (
                                <Chip
                                  label={getStatusText(
                                    getShopInfo(reservation.shopName!)
                                      ?.approve || "PENDING"
                                  )}
                                  color={getStatusColor(
                                    getShopInfo(reservation.shopName!)
                                      ?.approve || "PENDING"
                                  )}
                                  size="small"
                                />
                              )} */}
                            </Stack>
                          </TableCell>

                          <TableCell align="center">
                            <Typography>
                              {dayjs(reservation.reservedAt!).format(
                                "YY.MM.DD HH:mm"
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {reservation.headCount}명
                          </TableCell>
                          <TableCell align="center">
                            {reservation.phoneNumber}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={
                                reservationStatusLabel[
                                  reservation.status || ""
                                ] || reservation.status
                              }
                              color={
                                reservationStatusColor[
                                  reservation.status || ""
                                ] || "default"
                              }
                              size="small"
                              sx={{ fontWeight: 500, minWidth: 72 }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {reservation.status === "PENDING" && (
                              <>
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  onClick={() =>
                                    handleConfirmReservation(
                                      reservation.reservationId!
                                    )
                                  }
                                  disabled={confirmReservation.isPending}
                                >
                                  수락
                                </Button>
                                <Button
                                  variant="contained"
                                  color="error"
                                  sx={{ ml: 1 }}
                                  onClick={() =>
                                    handleRefuseReservation(
                                      reservation.reservationId!
                                    )
                                  }
                                  disabled={
                                    confirmReservation.isPending ||
                                    refuseReservation.isPending
                                  }
                                  size="small"
                                >
                                  {refuseReservation.isPending
                                    ? "처리중..."
                                    : "거절"}
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </Stack>
    </>
  );
};

export default ProfileMyShopsReservationTab;
