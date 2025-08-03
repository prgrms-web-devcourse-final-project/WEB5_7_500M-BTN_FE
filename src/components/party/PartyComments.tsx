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
  Collapse,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
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

interface CommentItemProps {
  comment: CommentResponse;
  partyId: number;
  currentUserId?: number;
  onDeleteComment: (commentId: number) => void;
  onReplyComment: (parentId: number) => void;
  replyingTo?: number;
  setReplyingTo: (commentId?: number) => void;
  newReplyContent: string;
  setNewReplyContent: (content: string) => void;
  onSubmitReply: () => void;
  isSubmittingReply: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  partyId,
  currentUserId,
  onDeleteComment,
  onReplyComment,
  replyingTo,
  setReplyingTo,
  newReplyContent,
  setNewReplyContent,
  onSubmitReply,
  isSubmittingReply,
}) => {
  const canDeleteComment = comment.writer?.userId === currentUserId;
  const isReplying = replyingTo === comment.commentId;

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmitReply();
    }
  };

  return (
    <Box
      sx={{
        pl: comment.parentId ? 4 : 0,
        borderLeft: comment.parentId ? "2px solid #e0e0e0" : "none",
        ml: comment.parentId ? 2 : 0,
        pb: comment.parentId ? 2.5 : 1,
      }}
    >
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
            {!comment.parentId && (
              <IconButton
                size="small"
                onClick={() => onReplyComment(comment.commentId!)}
                sx={{ ml: "auto" }}
              >
                <ReplyIcon fontSize="small" />
              </IconButton>
            )}
            {canDeleteComment && (
              <IconButton
                size="small"
                onClick={() =>
                  comment.commentId && onDeleteComment(comment.commentId)
                }
                sx={{ ml: 1 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {comment.content}
          </Typography>

          {/* 대댓글 작성 폼 */}
          {isReplying && (
            <Collapse in={isReplying}>
              <Box sx={{ mt: 2, pl: 2, borderLeft: "2px solid #1976d2" }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar sx={{ width: 32, height: 32 }} />
                  <Box flex={1}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder={`${
                        comment.writer?.nickname || "익명"
                      }님에게 답글 작성...`}
                      value={newReplyContent}
                      onChange={(e) => setNewReplyContent(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isSubmittingReply}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      spacing={1}
                    >
                      <Button
                        size="small"
                        onClick={() => setReplyingTo(undefined)}
                        disabled={isSubmittingReply}
                      >
                        취소
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={onSubmitReply}
                        disabled={isSubmittingReply || !newReplyContent.trim()}
                        startIcon={
                          isSubmittingReply ? (
                            <CircularProgress size={16} />
                          ) : (
                            <SendIcon />
                          )
                        }
                      >
                        {isSubmittingReply ? "작성 중..." : "답글 작성"}
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Collapse>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

const PartyComments: React.FC<PartyCommentsProps> = ({ partyId }) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | undefined>(undefined);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const { data: commentsData, isLoading, error } = usePartyComments(partyId);
  const { data: myInfoData } = useMyInfo();
  const createCommentMutation = useCreatePartyComment();
  const deleteCommentMutation = useDeletePartyComment();
  const { showToast } = useToast();

  const comments = commentsData?.data || [];
  const currentUserId = myInfoData?.data?.userId;

  // 댓글을 부모 댓글과 대댓글로 분리
  const parentComments = comments.filter((comment) => !comment.parentId);
  const replyComments = comments.filter((comment) => comment.parentId);

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

  const handleSubmitReply = async () => {
    if (!newReplyContent.trim() || !replyingTo) {
      showToast("답글 내용을 입력해주세요.", "warning");
      return;
    }

    setIsSubmittingReply(true);
    try {
      await createCommentMutation.mutateAsync({
        partyId,
        commentData: {
          content: newReplyContent.trim(),
          parentId: replyingTo,
        },
      });
      setNewReplyContent("");
      setReplyingTo(undefined);
      showToast("답글이 작성되었습니다.", "success");
    } catch (error) {
      console.error("답글 작성 실패:", error);
      showToast("답글 작성에 실패했습니다.", "error");
    } finally {
      setIsSubmittingReply(false);
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

  const handleReplyComment = (parentId: number) => {
    setReplyingTo(parentId);
    setNewReplyContent("");
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
          {parentComments.map((comment) => {
            // 해당 부모 댓글의 대댓글들 찾기
            const replies = replyComments.filter(
              (reply) => reply.parentId === comment.commentId
            );

            return (
              <Box key={comment.commentId}>
                <CommentItem
                  comment={comment}
                  partyId={partyId}
                  currentUserId={currentUserId}
                  onDeleteComment={handleDeleteComment}
                  onReplyComment={handleReplyComment}
                  replyingTo={replyingTo}
                  setReplyingTo={setReplyingTo}
                  newReplyContent={newReplyContent}
                  setNewReplyContent={setNewReplyContent}
                  onSubmitReply={handleSubmitReply}
                  isSubmittingReply={isSubmittingReply}
                />

                {/* 대댓글들 표시 */}
                {replies.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {replies.map((reply) => (
                      <CommentItem
                        key={reply.commentId}
                        comment={reply}
                        partyId={partyId}
                        currentUserId={currentUserId}
                        onDeleteComment={handleDeleteComment}
                        onReplyComment={handleReplyComment}
                        replyingTo={replyingTo}
                        setReplyingTo={setReplyingTo}
                        newReplyContent={newReplyContent}
                        setNewReplyContent={setNewReplyContent}
                        onSubmitReply={handleSubmitReply}
                        isSubmittingReply={isSubmittingReply}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default PartyComments;
