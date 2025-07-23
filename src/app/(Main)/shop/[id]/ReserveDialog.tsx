import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";
import { getTimeOptions, isPast } from "./reserveUtils";
import { useToast } from "@/features/common/Toast";
import Toast from "@/features/common/Toast";
import { useCreateReservation, useMyInfo } from "@/api/hooks";
import {
  requestPayment,
  generateOrderId,
  formatAmount,
} from "@/utils/tossPayments";
import type { ShopDetailResponse } from "@/api/generated";

interface ReserveDialogProps {
  open: boolean;
  onClose: () => void;
  shop: ShopDetailResponse;
  onReserveSuccess?: () => void;
}

const ReserveDialog: React.FC<ReserveDialogProps> = ({
  open,
  onClose,
  shop,
  onReserveSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [people, setPeople] = useState(1);
  const { toast, showToast, hideToast } = useToast();

  const createReservationMutation = useCreateReservation();
  const { data: myInfoData } = useMyInfo();
  const myInfo = myInfoData?.data;

  // 영업시간 포맷팅
  const formatTime = (time: any) => {
    if (!time) return "";
    const hours = time.hour?.toString().padStart(2, "0") || "00";
    const minutes = time.minute?.toString().padStart(2, "0") || "00";
    return `${hours}:${minutes}`;
  };

  const openTime = formatTime(shop.openTime);
  const closeTime = formatTime(shop.closeTime);

  const handlePayment = async () => {
    if (!selectedDate || !selectedTime) {
      showToast("날짜와 시간을 선택해주세요.", "error");
      return;
    }

    if (!myInfo) {
      showToast("로그인이 필요합니다.", "error");
      return;
    }

    try {
      // 1. 예약 생성
      const reservationResponse = await createReservationMutation.mutateAsync({
        shopId: shop.shopId!,
        reservationData: {
          date: selectedDate.format("YYYY-MM-DD"),
          time: selectedTime,
          headCount: people,
          reservationFee: shop.reservationFee || 0,
        },
      });

      // 2. 토스 페이먼츠 결제 요청
      const orderId = generateOrderId();
      const amount = shop.reservationFee || 0;
      const orderName = `${shop.shopName} 예약 (${selectedDate.format(
        "MM/DD"
      )} ${selectedTime})`;

      await requestPayment({
        amount,
        orderId,
        orderName,
        customerName: myInfo.name || myInfo.nickname || "고객",
        customerEmail: myInfo.email || "",
      });

      // 결제 요청이 성공하면 토스 페이먼츠 페이지로 리다이렉트됨
      // 성공/실패는 각각의 페이지에서 처리됨
    } catch (error) {
      console.error("예약/결제 실패:", error);
      showToast("예약에 실패했습니다. 다시 시도해주세요.", "error");
    }
  };

  return (
    <>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={hideToast}
      />
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogContent sx={{ p: 4, position: "relative" }}>
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700} mb={2}>
            예약하기
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DatePicker
              label="날짜 선택"
              value={selectedDate}
              onChange={(v) => {
                setSelectedDate(v);
                setSelectedTime(null);
              }}
              disablePast
              sx={{ width: "100%", mb: 3 }}
            />
          </LocalizationProvider>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            시간 선택
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} mb={3}>
            {getTimeOptions(selectedDate!, openTime, closeTime).map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "contained" : "outlined"}
                color="primary"
                size="small"
                disabled={isPast(selectedDate!, time)}
                onClick={() => setSelectedTime(time)}
                sx={{ minWidth: 72 }}
              >
                {time}
              </Button>
            ))}
          </Stack>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            인원
          </Typography>
          <Stack direction="row" alignItems="center" gap={2} mb={3}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPeople((p) => Math.max(1, p - 1))}
              disabled={people <= 1}
            >
              -
            </Button>
            <Typography>{people}명</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPeople((p) => p + 1)}
            >
              +
            </Button>
          </Stack>
          <Paper
            sx={{
              bgcolor: "#fffbe6",
              p: 2,
              mb: 2,
              border: "1px solid #ffe082",
            }}
            elevation={0}
          >
            <Typography color="warning.main" fontWeight={600}>
              예약금 결제 {formatAmount(shop.reservationFee || 0)}원이
              필요합니다.
            </Typography>
          </Paper>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={
              !selectedDate ||
              !selectedTime ||
              createReservationMutation.isPending
            }
            onClick={handlePayment}
            startIcon={
              createReservationMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {createReservationMutation.isPending ? "처리 중..." : "결제하기"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReserveDialog;
