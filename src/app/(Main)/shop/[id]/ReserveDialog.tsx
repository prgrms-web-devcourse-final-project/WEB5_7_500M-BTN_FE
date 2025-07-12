import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Button,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";
import { getTimeOptions, isPast } from "./reserveUtils";

interface Shop {
  id: string;
  name: string;
  businessHours: string;
}

interface ReserveDialogProps {
  open: boolean;
  onClose: () => void;
  shop: Shop;
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

  // 영업시간 파싱 (예: "08:00 - 22:00")
  const [openTime, closeTime] = shop.businessHours
    .split("-")
    .map((s) => s.trim());

  return (
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
          sx={{ bgcolor: "#fffbe6", p: 2, mb: 2, border: "1px solid #ffe082" }}
          elevation={0}
        >
          <Typography color="warning.main" fontWeight={600}>
            예약금 결제 1만원이 필요합니다.
          </Typography>
        </Paper>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={!selectedDate || !selectedTime}
          onClick={() => {
            // 결제 로직 (예시)
            alert("결제 및 예약 완료!");
            onClose();
            onReserveSuccess?.();
          }}
        >
          결제하기
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ReserveDialog;
