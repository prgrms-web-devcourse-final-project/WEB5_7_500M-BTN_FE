"use client";
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
} from "@mui/material";
import { useState } from "react";
import {
  useReservations,
  useConfirmReservation,
  useRefuseReservation,
} from "@/api/hooks";
import { useToast } from "@/features/common/Toast";
import Toast from "@/features/common/Toast";
import { GetReservationsFilterEnum, ReservationContent } from "@/api/generated";

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

const ReservationStatusPage = () => {
  const { toast, showToast, hideToast } = useToast();
  const [selectedShopId, setSelectedShopId] = useState<number | undefined>(
    undefined
  );

  const {
    data: reservationsData,
    isLoading,
    error,
  } = useReservations({
    filter: GetReservationsFilterEnum.Pending,
    size: 50,
    shopId: selectedShopId,
  });

  const confirmReservation = useConfirmReservation();
  const refuseReservation = useRefuseReservation();

  const reservations = reservationsData?.content || [];

  const handleAccept = async (reservationId: number) => {
    try {
      await confirmReservation.mutateAsync(reservationId);
      showToast("예약이 수락되었습니다.", "success");
    } catch (error) {
      console.error("예약 수락 실패:", error);
      showToast("예약 수락에 실패했습니다.", "error");
    }
  };

  const handleReject = async (reservationId: number) => {
    try {
      await refuseReservation.mutateAsync(reservationId);
      showToast("예약이 거절되었습니다.", "success");
    } catch (error) {
      console.error("예약 거절 실패:", error);
      showToast("예약 거절에 실패했습니다.", "error");
    }
  };

  if (isLoading) {
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

  if (error) {
    return (
      <Box maxWidth={1000} mx="auto" px={3} py={6}>
        <Alert severity="error">
          예약 정보를 불러오는데 실패했습니다. 다시 시도해주세요.
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={hideToast}
      />
      <Box maxWidth={1000} mx="auto" px={3} py={6}>
        <Typography variant="h4" fontWeight={700} mb={4}>
          예약 현황
        </Typography>

        {reservations.length === 0 ? (
          <Alert severity="info">현재 대기중인 예약이 없습니다.</Alert>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 3, boxShadow: 2 }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f8fafc" }}>
                  <TableCell align="center">예약자</TableCell>
                  <TableCell align="center">일시</TableCell>
                  <TableCell align="center">인원</TableCell>
                  <TableCell align="center">연락처</TableCell>
                  <TableCell align="center">메모</TableCell>
                  <TableCell align="center">상태</TableCell>
                  <TableCell align="center">관리</TableCell>
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
                      <Typography>{reservation.reservedAt}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      {reservation.headCount}명
                    </TableCell>
                    <TableCell align="center">
                      {reservation.phoneNumber}
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
                        color={
                          statusColor[reservation.status || ""] || "default"
                        }
                        size="small"
                        sx={{ fontWeight: 500, minWidth: 72 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {reservation.status === "PENDING" ? (
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() =>
                              handleAccept(reservation.reservationId!)
                            }
                            disabled={
                              confirmReservation.isPending ||
                              refuseReservation.isPending
                            }
                            sx={{ minWidth: 64, fontWeight: 600 }}
                          >
                            {confirmReservation.isPending
                              ? "처리중..."
                              : "수락"}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() =>
                              handleReject(reservation.reservationId!)
                            }
                            disabled={
                              confirmReservation.isPending ||
                              refuseReservation.isPending
                            }
                            sx={{ minWidth: 64, fontWeight: 600 }}
                          >
                            {refuseReservation.isPending ? "처리중..." : "거절"}
                          </Button>
                        </Stack>
                      ) : (
                        <Typography color="text.secondary" fontSize={14}>
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
      </Box>
    </>
  );
};

export default ReservationStatusPage;
