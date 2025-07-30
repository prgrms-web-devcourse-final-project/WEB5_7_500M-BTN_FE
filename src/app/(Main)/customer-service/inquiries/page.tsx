"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Pagination,
  CircularProgress,
  Alert,
  Container,
  TablePagination,
} from "@mui/material";
import { Add as AddIcon, Chat as ChatIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useInquiries, useMyInfo } from "@/api/hooks";
import { InquiryItem, MyInfoResponseRoleEnum } from "@/api/generated";

const getStatusColor = (answerCount: number) => {
  if (answerCount > 0) {
    return "success";
  }
  return "warning";
};

const getStatusText = (answerCount: number) => {
  if (answerCount > 0) {
    return "답변 완료";
  }
  return "답변 대기";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default function InquiriesPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [cursor, setCursor] = useState<number | undefined>(undefined);

  const {
    data: inquiriesData,
    isLoading,
    error,
  } = useInquiries({
    cursor,
    size: rowsPerPage,
  });

  const { data: myInfoData } = useMyInfo();
  const userRole = myInfoData?.data?.role;
  const isAdmin = userRole === MyInfoResponseRoleEnum.Admin;

  const inquiries = inquiriesData?.data?.content || [];
  const nextCursor = inquiriesData?.data?.nextCursor;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value - 1);
    // 페이지네이션 로직 구현 (커서 기반)
    // 실제 구현에서는 커서 기반 페이지네이션을 사용해야 함
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateInquiry = () => {
    router.push("/customer-service/create");
  };

  const handleInquiryClick = (inquiryId: number) => {
    router.push(`/customer-service/${inquiryId}`);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          문의글 목록을 불러오는데 실패했습니다.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              문의글 목록
            </Typography>
            {isAdmin && (
              <Chip
                label="관리자 모드"
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateInquiry}
            sx={{ borderRadius: 2 }}
          >
            문의글 작성
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", width: "10%" }}>
                  번호
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", width: "50%" }}>
                  제목
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", width: "15%" }}>
                  작성일
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", width: "15%" }}>
                  답변수
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", width: "10%" }}>
                  상태
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inquiries.map((inquiry: InquiryItem, index: number) => (
                <TableRow
                  key={inquiry.InquiryId}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleInquiryClick(inquiry.InquiryId!)}
                >
                  <TableCell>{inquiries.length - index}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "medium",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "400px",
                      }}
                    >
                      {inquiry.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {inquiry.createTime
                        ? formatDate(inquiry.createTime)
                        : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ChatIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {inquiry.answerCount || 0}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(inquiry.answerCount || 0)}
                      color={getStatusColor(inquiry.answerCount || 0)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {inquiries.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {isAdmin
                ? "등록된 문의글이 없습니다"
                : "아직 작성된 문의글이 없습니다"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {isAdmin
                ? "사용자들이 문의글을 작성하면 여기에 표시됩니다."
                : "첫 번째 문의글을 작성해보세요!"}
            </Typography>
            {!isAdmin && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateInquiry}
              >
                문의글 작성하기
              </Button>
            )}
          </Box>
        )}

        {inquiries.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={-1} // 커서 기반 페이지네이션에서는 정확한 총 개수를 알 수 없음
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to }) => `${from}-${to}`}
            labelRowsPerPage="페이지당 행 수:"
          />
        )}
      </Paper>
    </Container>
  );
}
