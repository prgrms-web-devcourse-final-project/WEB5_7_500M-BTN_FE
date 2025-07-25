"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
  Divider,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/common";
import { CreateInquiryRequest } from "@/types";

export default function CreateInquiryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateInquiryRequest>({
    title: "",
    content: "",
    images: [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    } else if (formData.title.length > 100) {
      newErrors.title = "제목은 100자 이내로 입력해주세요.";
    }

    if (!formData.content.trim()) {
      newErrors.content = "내용을 입력해주세요.";
    } else if (formData.content.length > 2000) {
      newErrors.content = "내용은 2000자 이내로 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 실제 API 호출 대신 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 성공 시 목록 페이지로 이동
      router.push("/customer-service?success=true");
    } catch (error) {
      console.error("문의글 작성 실패:", error);
      setErrors({ submit: "문의글 작성에 실패했습니다. 다시 시도해주세요." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateInquiryRequest,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 에러 메시지 제거
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImagesChange = (images: File[]) => {
    setFormData((prev) => ({ ...prev, images }));
  };

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
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            문의글 작성
          </Typography>
          <Typography variant="body1" color="text.secondary">
            궁금한 점이나 문제가 있으시면 자세히 작성해주세요.
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* 폼 */}
        <Box component="form" onSubmit={handleSubmit}>
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.submit}
            </Alert>
          )}

          {/* 제목 입력 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              제목 *
            </Typography>
            <TextField
              fullWidth
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="문의 제목을 입력해주세요"
              error={!!errors.title}
              helperText={errors.title || `${formData.title.length}/100`}
              inputProps={{ maxLength: 100 }}
            />
          </Box>

          {/* 내용 입력 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              내용 *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="문의 내용을 자세히 작성해주세요"
              error={!!errors.content}
              helperText={errors.content || `${formData.content.length}/2000`}
              inputProps={{ maxLength: 2000 }}
            />
          </Box>

          {/* 이미지 업로드 */}
          <Box sx={{ mb: 4 }}>
            <ImageUpload
              images={formData.images || []}
              onImagesChange={handleImagesChange}
              maxImages={5}
            />
          </Box>

          {/* 안내사항 */}
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="body2">
              • 문의글은 24시간 이내에 답변드립니다.
              <br />
              • 개인정보가 포함된 내용은 제외하고 작성해주세요.
              <br />• 이미지는 최대 5개까지 첨부 가능합니다.
            </Typography>
          </Alert>

          {/* 버튼 */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              disabled={isSubmitting}
              sx={{ minWidth: 120 }}
            >
              {isSubmitting ? "작성 중..." : "문의글 작성"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
