import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  Rating,
  TextField,
  Button,
  Box,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCreateReview, uploadImageToS3 } from "@/api/hooks";
import { useToast } from "@/features/common/Toast";
import type {
  ReviewCreateRequest,
  MyReservationResponse,
} from "@/api/generated";

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  reviewTarget: MyReservationResponse | null;
  reviewContent: string;
  setReviewContent: (v: string) => void;
  reviewRating: number;
  setReviewRating: (v: number) => void;
}

const ReviewDialog = ({
  open,
  onClose,
  onSave,
  reviewTarget,
  reviewContent,
  setReviewContent,
  reviewRating,
  setReviewRating,
}: ReviewDialogProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createReviewMutation = useCreateReview();
  const { showToast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (selectedFiles.length + files.length > 5) {
      showToast("이미지는 최대 5개까지 업로드할 수 있습니다.", "warning");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveReview = async () => {
    if (!reviewContent.trim()) {
      showToast("리뷰 내용을 입력해주세요.", "warning");
      return;
    }

    if (!reviewTarget?.reservationId) {
      showToast("예약 정보를 찾을 수 없습니다.", "error");
      return;
    }

    setUploading(true);
    try {
      // 1. 리뷰 생성 요청 (이미지 개수 포함)
      const reviewData: ReviewCreateRequest = {
        reservationId: reviewTarget.reservationId,
        shopId: 0, // 백엔드에서 예약 ID로 shopId를 조회하도록 함
        content: reviewContent,
        rating: reviewRating,
        imageCount: selectedFiles.length,
      };

      const response = await createReviewMutation.mutateAsync(reviewData);

      // 2. PreSigned URL이 있으면 이미지 업로드
      if (response.data?.items && selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map((file, index) => {
          const presignedUrl = response.data?.items?.[index];
          if (presignedUrl?.url) {
            return uploadImageToS3(file, presignedUrl.url);
          }
          return Promise.resolve();
        });

        await Promise.all(uploadPromises);
      }

      showToast("리뷰가 성공적으로 작성되었습니다.", "success");
      onSave();
      onClose();
    } catch (error) {
      console.error("리뷰 작성 실패:", error);
      showToast("리뷰 작성에 실패했습니다.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>리뷰 작성</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography fontWeight={600}>
            {reviewTarget?.shopName ?? ""}
          </Typography>

          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              별점
            </Typography>
            <Rating
              value={reviewRating}
              precision={0.5}
              onChange={(_, v) => setReviewRating(v || 0)}
              size="large"
            />
          </Box>

          <TextField
            label="리뷰 내용"
            multiline
            minRows={3}
            maxRows={6}
            fullWidth
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder="음식과 서비스에 대한 솔직한 리뷰를 작성해주세요."
          />

          {/* 이미지 업로드 섹션 */}
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              이미지 (선택사항, 최대 5개)
            </Typography>

            <Box display="flex" gap={1} flexWrap="wrap">
              {selectedFiles.map((file, index) => (
                <Box
                  key={index}
                  position="relative"
                  width={80}
                  height={80}
                  border={1}
                  borderColor="divider"
                  borderRadius={1}
                  overflow="hidden"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`업로드 이미지 ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(index)}
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      bgcolor: "rgba(0,0,0,0.5)",
                      color: "white",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              {selectedFiles.length < 5 && (
                <Button
                  variant="outlined"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    width: 80,
                    height: 80,
                    borderStyle: "dashed",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  <AddPhotoAlternateIcon />
                  <Typography variant="caption">추가</Typography>
                </Button>
              )}
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
          </Box>

          {createReviewMutation.isError && (
            <Alert severity="error">리뷰 작성 중 오류가 발생했습니다.</Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          취소
        </Button>
        <Button
          onClick={handleSaveReview}
          variant="contained"
          disabled={uploading || createReviewMutation.isPending}
          startIcon={
            uploading || createReviewMutation.isPending ? (
              <CircularProgress size={16} />
            ) : null
          }
        >
          {uploading || createReviewMutation.isPending ? "저장 중..." : "저장"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog;
