import React from "react";
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
} from "@mui/material";

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  reviewTarget: any;
  reviewContent: string;
  setReviewContent: (v: string) => void;
  reviewRating: number;
  setReviewRating: (v: number) => void;
  isEdit: boolean;
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
  isEdit,
}: ReviewDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>리뷰 {isEdit ? "수정" : "작성"}</DialogTitle>
    <DialogContent>
      <Stack spacing={2} mt={1}>
        <Typography fontWeight={600}>
          {reviewTarget?.shop?.name ?? ""}
        </Typography>
        <Rating
          value={reviewRating}
          precision={0.5}
          onChange={(_, v) => setReviewRating(v || 0)}
          size="large"
        />
        <TextField
          label="리뷰 내용"
          multiline
          minRows={3}
          maxRows={6}
          fullWidth
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
        />
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>취소</Button>
      <Button onClick={onSave} variant="contained">
        저장
      </Button>
    </DialogActions>
  </Dialog>
);

export default ReviewDialog;
