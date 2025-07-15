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
} from "@mui/material";
import { reservations, ReservationStatus } from "@/mock/reservation";
import { useState } from "react";

const statusColor: Record<
  ReservationStatus | "대기중",
  "primary" | "success" | "error" | "warning"
> = {
  "예약 완료": "primary",
  "방문 완료": "success",
  취소됨: "error",
  대기중: "warning",
};

// 예약 상태가 "예약 완료"가 아닌 경우(대기중) 사장님이 수락/거절 가능하도록 가정
// 실제로는 status: "대기중"이 있을 수 있음. 예시로 첫 번째 예약을 대기중으로 처리
const initialReservations = reservations.map((r, idx) =>
  idx === 0 ? { ...r, status: "대기중" as const } : r
);

type LocalReservation = (typeof initialReservations)[number];

const ReservationStatusPage = () => {
  const [data, setData] = useState<LocalReservation[]>(initialReservations);

  const handleAccept = (id: string) => {
    setData((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "예약 완료" } : r))
    );
  };
  const handleReject = (id: string) => {
    setData((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "취소됨" } : r))
    );
  };

  return (
    <Box maxWidth={1000} mx="auto" px={3} py={6}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        예약 현황
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
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
            {data.map((r) => (
              <TableRow
                key={r.id}
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
                      src={r.customer.profileImage}
                      alt={r.customer.nickname}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Typography fontWeight={600}>
                      {r.customer.nickname}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <Typography>
                    {r.date} {r.time}
                  </Typography>
                </TableCell>
                <TableCell align="center">{r.people}명</TableCell>
                <TableCell align="center">{r.phone}</TableCell>
                <TableCell
                  align="center"
                  sx={{ maxWidth: 180, wordBreak: "break-all" }}
                >
                  {r.memo || <span style={{ color: "#bbb" }}>-</span>}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={r.status}
                    color={statusColor[r.status]}
                    size="small"
                    sx={{ fontWeight: 500, minWidth: 72 }}
                  />
                </TableCell>
                <TableCell align="center">
                  {r.status === "대기중" ? (
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleAccept(r.id)}
                        sx={{ minWidth: 64, fontWeight: 600 }}
                      >
                        수락
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleReject(r.id)}
                        sx={{ minWidth: 64, fontWeight: 600 }}
                      >
                        거절
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
    </Box>
  );
};

export default ReservationStatusPage;
