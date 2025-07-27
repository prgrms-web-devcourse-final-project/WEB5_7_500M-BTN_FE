"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Pagination,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import { Add as AddIcon, Chat as ChatIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { getMockInquiries } from "@/data/mockInquiryData";
import { CustomerInquiry } from "@/types";

const getStatusColor = (status: CustomerInquiry["status"]) => {
  switch (status) {
    case "pending":
      return "warning";
    case "answered":
      return "success";
    case "closed":
      return "default";
    default:
      return "default";
  }
};

const getStatusText = (status: CustomerInquiry["status"]) => {
  switch (status) {
    case "pending":
      return "답변 대기";
    case "answered":
      return "답변 완료";
    case "closed":
      return "처리 완료";
    default:
      return "알 수 없음";
  }
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
  const [page, setPage] = useState(1);
  const { inquiries, totalCount } = getMockInquiries(page, 10);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleCreateInquiry = () => {
    router.push("/customer-service/create");
  };

  const handleInquiryClick = (inquiryId: number) => {
    router.push(`/customer-service/${inquiryId}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            문의글 목록
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateInquiry}
            sx={{ borderRadius: 2 }}
          >
            문의글 작성
          </Button>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          궁금한 점이나 문제가 있으시면 언제든 문의해주세요.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {inquiries.map((inquiry) => (
          <Grid item xs={12} key={inquiry.id}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                },
              }}
              onClick={() => handleInquiryClick(inquiry.id)}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ flex: 1, mr: 2 }}
                  >
                    {inquiry.title}
                  </Typography>
                  <Chip
                    label={getStatusText(inquiry.status)}
                    color={getStatusColor(inquiry.status)}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {inquiry.content}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    작성일: {formatDate(inquiry.createdAt)}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {inquiry.images && inquiry.images.length > 0 && (
                      <Chip
                        label={`이미지 ${inquiry.images.length}개`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {inquiry.answer && (
                      <Chip
                        icon={<ChatIcon />}
                        label="답변 있음"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {inquiries.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            아직 작성된 문의글이 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            첫 번째 문의글을 작성해보세요!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateInquiry}
          >
            문의글 작성하기
          </Button>
        </Box>
      )}

      {totalCount > 10 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(totalCount / 10)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Container>
  );
}
