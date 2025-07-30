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
  Box,
  Alert,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";
import { getTimeGridOptions } from "./reserveUtils";
import { useToast } from "@/features/common/Toast";
import Toast from "@/features/common/Toast";
import { useCreateReservation, useMyInfo } from "@/api/hooks";
import {
  requestPayment,
  generateOrderId,
  formatAmount,
} from "@/utils/tossPayments";
import type { ShopDetailResponse } from "@/api/generated";

interface PointPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  shop: ShopDetailResponse;
  onReserveSuccess?: () => void;
}

const PointPaymentDialog: React.FC<PointPaymentDialogProps> = ({
  open,
  onClose,
  shop,
  onReserveSuccess,
}) => {
  const { showToast, hideToast } = useToast();
  const { data: myInfo } = useMyInfo();
  const createReservationMutation = useCreateReservation();

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [people, setPeople] = useState<number>(2);
  const [paymentMethod, setPaymentMethod] = useState<"point" | "card">("point");
  const [isProcessing, setIsProcessing] = useState(false);

  const reservationFee = shop.reservationFee || 0;
  const userPoints = myInfo?.data?.point || 0;
  const canUsePoints = userPoints >= reservationFee;

  const handlePayment = async () => {
    if (!selectedDate || !selectedTime) {
      showToast("날짜와 시간을 선택해주세요.", "error");
      return;
    }

    if (!myInfo?.data) {
      showToast("로그인이 필요합니다.", "error");
      return;
    }

    if (paymentMethod === "point" && !canUsePoints) {
      showToast("포인트가 부족합니다. 충전 후 이용해주세요.", "error");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. 예약 생성
      const reservationResponse = await createReservationMutation.mutateAsync({
        shopId: shop.shopId!,
        reservationData: {
          date: selectedDate.format("YYYY-MM-DD"),
          time: selectedTime,
          headCount: people,
          reservationFee: reservationFee,
        },
      });

      // 2. 결제 방법에 따라 처리
      if (paymentMethod === "point") {
        // 포인트 결제 (백엔드에서 처리될 것으로 예상)
        showToast("예약이 완료되었습니다!", "success");
        onReserveSuccess?.();
        onClose();
      } else {
        // 카드 결제 (기존 토스페이먼츠 방식)
        const orderId = generateOrderId();
        const orderName = `${shop.shopName} 예약 (${selectedDate.format(
          "MM/DD"
        )} ${selectedTime})`;

        await requestPayment({
          amount: reservationFee,
          orderId,
          orderName,
          customerName: myInfo.data.name || myInfo.data.nickname || "고객",
          customerEmail: myInfo.data.email || "",
        });
      }
    } catch (error) {
      console.error("예약/결제 실패:", error);
      showToast("예약에 실패했습니다. 다시 시도해주세요.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setSelectedDate(null);
      setSelectedTime("");
      setPeople(2);
      setPaymentMethod("point");
      onClose();
    }
  };

  const timeOptions = selectedDate
    ? getTimeGridOptions(selectedDate, "11:00", "22:00").map(
        (slot) => slot.time
      )
    : [];

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* 헤더 */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                {shop.shopName} 예약
              </Typography>
              <IconButton onClick={handleClose} disabled={isProcessing}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* 예약 정보 */}
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                예약 정보
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  예약금: {formatAmount(reservationFee)}원
                </Typography>
                <Typography variant="body2">
                  보유 포인트: {formatAmount(userPoints)}포인트
                </Typography>
                {!canUsePoints && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    포인트가 부족합니다. 충전 후 이용하거나 카드로 결제해주세요.
                  </Alert>
                )}
              </Stack>
            </Paper>

            {/* 날짜 선택 */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                날짜 선택
              </Typography>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="ko"
              >
                <DatePicker
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  minDate={dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      placeholder: "날짜를 선택해주세요",
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>

            {/* 시간 선택 */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                시간 선택
              </Typography>
              <RadioGroup
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                row
                sx={{ flexWrap: "wrap", gap: 1 }}
              >
                {timeOptions.map((time) => (
                  <FormControlLabel
                    key={time}
                    value={time}
                    control={<Radio size="small" />}
                    label={time}
                    sx={{
                      margin: 0,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </Box>

            {/* 인원 선택 */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                인원 선택
              </Typography>
              <RadioGroup
                value={people.toString()}
                onChange={(e) => setPeople(parseInt(e.target.value))}
                row
                sx={{ flexWrap: "wrap", gap: 1 }}
              >
                {[2, 3, 4, 5, 6, 7, 8].map((count) => (
                  <FormControlLabel
                    key={count}
                    value={count.toString()}
                    control={<Radio size="small" />}
                    label={`${count}명`}
                    sx={{
                      margin: 0,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </Box>

            <Divider />

            {/* 결제 방법 선택 */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                결제 방법
              </Typography>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as "point" | "card")
                }
              >
                <FormControlLabel
                  value="point"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        포인트 결제
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {canUsePoints
                          ? `${formatAmount(reservationFee)} 포인트 차감`
                          : "포인트 부족 - 충전 필요"}
                      </Typography>
                    </Box>
                  }
                  disabled={!canUsePoints}
                />
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        카드 결제
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        토스페이먼츠로 안전하게 결제
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </Box>

            {/* 결제 금액 요약 */}
            <Paper elevation={1} sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                결제 금액
              </Typography>
              <Typography variant="h6" fontWeight={600} color="primary.main">
                {formatAmount(reservationFee)}원
              </Typography>
              {paymentMethod === "point" && canUsePoints && (
                <Typography variant="caption" color="success.main">
                  결제 후 잔여 포인트:{" "}
                  {formatAmount(userPoints - reservationFee)}포인트
                </Typography>
              )}
            </Paper>
          </Stack>
        </DialogContent>

        {/* 하단 버튼 */}
        <Box sx={{ p: 3, pt: 0 }}>
          <Stack direction="row" spacing={2}>
            <Button
              onClick={handleClose}
              variant="outlined"
              fullWidth
              disabled={isProcessing}
            >
              취소
            </Button>
            <Button
              onClick={handlePayment}
              variant="contained"
              fullWidth
              disabled={
                isProcessing ||
                !selectedDate ||
                !selectedTime ||
                (paymentMethod === "point" && !canUsePoints)
              }
              startIcon={isProcessing ? <CircularProgress size={16} /> : null}
            >
              {isProcessing ? "처리 중..." : "예약하기"}
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </>
  );
};

export default PointPaymentDialog;
