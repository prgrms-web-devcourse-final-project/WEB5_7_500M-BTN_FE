"use client";

import React, { useState, useEffect, useMemo } from "react";
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

  // 서버에서 10000개를 가져오도록 수정
  const {
    data: inquiriesData,
    isLoading,
    error,
  } = useInquiries({
    size: 10000, // 모든 데이터를 가져옴
  });

  const { data: myInfoData } = useMyInfo();
  const userRole = myInfoData?.data?.role;
  const isAdmin = userRole === MyInfoResponseRoleEnum.Admin;

  const allInquiries = inquiriesData?.data?.content || [];

  // 클라이언트에서 페이지네이션 계산
  const paginatedInquiries = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return allInquiries.slice(startIndex, endIndex);
  }, [allInquiries, page, rowsPerPage]);

  // 총 페이지 수 계산
  const totalPages = useMemo(() => {
    return Math.ceil(allInquiries.length / rowsPerPage);
  }, [allInquiries.length, rowsPerPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value - 1);
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
              {paginatedInquiries.map((inquiry: InquiryItem, index: number) => (
                <TableRow
                  key={inquiry.InquiryId}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleInquiryClick(inquiry.InquiryId!)}
                >
                  <TableCell>{inquiry.InquiryId}</TableCell>
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

        {allInquiries.length === 0 && (
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

        {allInquiries.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
}
