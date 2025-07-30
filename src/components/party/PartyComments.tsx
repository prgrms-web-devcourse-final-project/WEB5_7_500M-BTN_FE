import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import {
  usePartyComments,
  useCreatePartyComment,
  useDeletePartyComment,
} from "@/api/hooks";
import { useToast } from "@/features/common/Toast";
import { useMyInfo } from "@/api/hooks";
import type { CommentResponse } from "@/api/generated";

interface PartyCommentsProps {
  partyId: number;
}

const PartyComments: React.FC<PartyCommentsProps> = ({ partyId }) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: commentsData, isLoading, error } = usePartyComments(partyId);
  const { data: myInfoData } = useMyInfo();
  const createCommentMutation = useCreatePartyComment();
  const deleteCommentMutation = useDeletePartyComment();
  const { showToast } = useToast();

  const comments = commentsData?.data || [];
  const currentUserId = myInfoData?.data?.userId;

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      showToast("댓글 내용을 입력해주세요.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await createCommentMutation.mutateAsync({
        partyId,
        commentData: {
          content: newComment.trim(),
        },
      });
      setNewComment("");
      showToast("댓글이 작성되었습니다.", "success");
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      showToast("댓글 작성에 실패했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmitComment();
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteCommentMutation.mutateAsync(commentId);
      showToast("댓글이 삭제되었습니다.", "success");
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      showToast("댓글 삭제에 실패했습니다.", "error");
    }
  };

  const canDeleteComment = (comment: CommentResponse) => {
    return comment.writer?.userId === currentUserId;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        댓글을 불러오는데 실패했습니다.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        댓글 ({comments.length})
      </Typography>

      {/* 댓글 작성 폼 */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar
            src={myInfoData?.data?.profile}
            sx={{ width: 40, height: 40, mt: 1 }}
          />
          <Box flex={1}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="댓글을 작성해주세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting}
              sx={{ mb: 1 }}
            />
            <Stack direction="row" justifyContent="flex-end">
              <Button
                variant="contained"
                size="small"
                onClick={handleSubmitComment}
                disabled={isSubmitting || !newComment.trim()}
                startIcon={
                  isSubmitting ? <CircularProgress size={16} /> : <SendIcon />
                }
              >
                {isSubmitting ? "작성 중..." : "댓글 작성"}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* 댓글 목록 */}
      {comments.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={4}>
          아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
        </Typography>
      ) : (
        <Stack spacing={2}>
          {comments.map((comment) => (
            <Box key={comment.commentId}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar sx={{ width: 40, height: 40 }} />
                <Box flex={1}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {comment.writer?.nickname || "익명"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(comment.createdAt).format("YYYY.MM.DD HH:mm")}
                    </Typography>
                    {canDeleteComment(comment) && (
                      <IconButton
                        size="small"
                        onClick={() =>
                          comment.commentId &&
                          handleDeleteComment(comment.commentId)
                        }
                        disabled={deleteCommentMutation.isPending}
                        sx={{ ml: "auto" }}
                      >
                        {deleteCommentMutation.isPending ? (
                          <CircularProgress size={16} />
                        ) : (
                          <DeleteIcon fontSize="small" />
                        )}
                      </IconButton>
                    )}
                  </Stack>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {comment.content}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default PartyComments;
