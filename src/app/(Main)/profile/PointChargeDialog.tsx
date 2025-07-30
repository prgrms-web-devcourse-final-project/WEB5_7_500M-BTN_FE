import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useToast } from "@/features/common/Toast";

import { useMyInfo } from "@/api/hooks";
import {
  requestPayment,
  generateOrderId,
  formatAmount,
} from "@/utils/tossPayments";
import { apiClient } from "@/api/client";

interface PointChargeDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const POINT_OPTIONS = [
  { amount: 10000, points: 10000, label: "10,000포인트" },
  { amount: 30000, points: 30000, label: "30,000포인트" },
  { amount: 50000, points: 50000, label: "50,000포인트" },
  { amount: 100000, points: 100000, label: "100,000포인트" },
];

const PointChargeDialog: React.FC<PointChargeDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { showToast, hideToast } = useToast();
  const { data: myInfo } = useMyInfo();
  const [selectedOption, setSelectedOption] = useState<string>("10000");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCharge = async () => {
    if (!myInfo) {
      showToast("로그인이 필요합니다.", "error");
      return;
    }

    const amount = parseInt(
      selectedOption === "custom" ? customAmount : selectedOption
    );

    if (isNaN(amount) || amount < 1000) {
      showToast("최소 1,000원 이상 충전해주세요.", "error");
      return;
    }

    if (amount > 1000000) {
      showToast("최대 1,000,000원까지 충전 가능합니다.", "error");
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = generateOrderId();
      const orderName = `포인트 충전 (${formatAmount(amount)}원)`;

      apiClient.saveOrder({ orderId, amount });

      await requestPayment({
        amount,
        orderId,
        orderName,
        customerName: myInfo.data?.name || myInfo.data?.nickname || "고객",
        customerEmail: myInfo.data?.email || "",
        isPointCharge: true,
      });

      // 결제 요청이 성공하면 토스 페이먼츠 페이지로 리다이렉트됨
      // 성공/실패는 각각의 페이지에서 처리됨
    } catch (error) {
      console.error("포인트 충전 실패:", error);
      showToast("포인트 충전에 실패했습니다. 다시 시도해주세요.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setSelectedOption("10000");
      setCustomAmount("");
      onClose();
    }
  };

  const selectedPointOption = POINT_OPTIONS.find(
    (option) => option.amount.toString() === selectedOption
  );
  const customPoints =
    selectedOption === "custom" && customAmount ? parseInt(customAmount) : 0;

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            포인트 충전
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <Alert severity="info">포인트로 예약금을 결제할 수 있습니다.</Alert>

            <FormControl component="fieldset">
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                충전 금액 선택
              </Typography>
              <RadioGroup
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                {POINT_OPTIONS.map((option) => (
                  <FormControlLabel
                    key={option.amount}
                    value={option.amount.toString()}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {option.label}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
                <FormControlLabel
                  value="custom"
                  control={<Radio />}
                  label="직접 입력"
                />
              </RadioGroup>
            </FormControl>

            {selectedOption === "custom" && (
              <TextField
                label="충전 금액 (원)"
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="1,000원 ~ 1,000,000원"
                inputProps={{
                  min: 1000,
                  max: 1000000,
                  step: 1000,
                }}
                helperText="1,000원 단위로 입력해주세요"
              />
            )}

            {selectedOption !== "custom" && selectedPointOption && (
              <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  충전 예정 포인트
                </Typography>
                <Typography variant="h6" fontWeight={600} color="primary.main">
                  {formatAmount(selectedPointOption.points)} 포인트
                </Typography>
              </Box>
            )}

            {selectedOption === "custom" && customPoints > 0 && (
              <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  충전 예정 포인트
                </Typography>
                <Typography variant="h6" fontWeight={600} color="primary.main">
                  {formatAmount(customPoints)} 포인트
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isProcessing}>
            취소
          </Button>
          <Button
            onClick={handleCharge}
            variant="contained"
            disabled={
              isProcessing || (selectedOption === "custom" && !customAmount)
            }
            startIcon={isProcessing ? <CircularProgress size={16} /> : null}
          >
            {isProcessing ? "처리 중..." : "충전하기"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PointChargeDialog;
