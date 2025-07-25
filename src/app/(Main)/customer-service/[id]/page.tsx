"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
  Divider,
  ImageList,
  ImageListItem,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { mockInquiries } from "@/data/mockInquiryData";
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
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface InquiryDetailPageProps {
  params: {
    id: string;
  };
}

export default function InquiryDetailPage({ params }: InquiryDetailPageProps) {
  const router = useRouter();
  const inquiryId = parseInt(params.id);
  const inquiry = mockInquiries.find((inq) => inq.id === inquiryId);

  if (!inquiry) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            문의글을 찾을 수 없습니다
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/customer-service")}
            sx={{ mt: 2 }}
          >
            목록으로 돌아가기
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* 헤더 */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}
              sx={{ color: "text.secondary" }}
            >
              뒤로가기
            </Button>
          </Stack>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              sx={{ flex: 1, mr: 2 }}
            >
              {inquiry.title}
            </Typography>
            <Chip
              label={getStatusText(inquiry.status)}
              color={getStatusColor(inquiry.status)}
              variant="outlined"
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            작성일: {formatDate(inquiry.createdAt)}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* 문의 내용 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            문의 내용
          </Typography>
          <Paper variant="outlined" sx={{ p: 3, backgroundColor: "grey.50" }}>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {inquiry.content}
            </Typography>
          </Paper>
        </Box>

        {/* 첨부 이미지 */}
        {inquiry.images && inquiry.images.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              첨부 이미지
            </Typography>
            <ImageList
              sx={{ width: "100%", height: "auto" }}
              cols={3}
              rowHeight={200}
            >
              {inquiry.images.map((image, index) => (
                <ImageListItem key={index}>
                  <img
                    src={image}
                    alt={`첨부 이미지 ${index + 1}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        )}

        {/* 답변 */}
        {inquiry.answer ? (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <ChatIcon sx={{ mr: 1, color: "success.main" }} />
              <Typography variant="h6" color="success.main">
                답변
              </Typography>
            </Box>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                backgroundColor: "success.50",
                borderColor: "success.main",
              }}
            >
              <Typography
                variant="body1"
                sx={{ whiteSpace: "pre-wrap", mb: 2 }}
              >
                {inquiry.answer.content}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                답변일: {formatDate(inquiry.answer.createdAt)}
              </Typography>
            </Paper>
          </Box>
        ) : inquiry.status === "pending" ? (
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="body2">
              문의하신 내용을 검토하고 있습니다. 24시간 이내에 답변드리겠습니다.
            </Typography>
          </Alert>
        ) : null}

        {/* 하단 버튼 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => router.push("/customer-service")}
          >
            목록으로
          </Button>

          {inquiry.status === "pending" && (
            <Button
              variant="contained"
              onClick={() =>
                router.push(`/customer-service/${inquiry.id}/edit`)
              }
            >
              수정하기
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
