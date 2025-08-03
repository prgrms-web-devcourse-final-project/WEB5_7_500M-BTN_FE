"use client";

import React, { useState } from "react";
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
  CircularProgress,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Chat as ChatIcon,
  Send as SendIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Warning as WarningIcon,
  Reply as ReplyIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import {
  useInquiryDetail,
  useInquiryComments,
  useCreateInquiryComment,
  useMyInfo,
} from "@/api/hooks";
import { MyInfoResponseRoleEnum } from "@/api/generated";
import type { CommentResponse } from "@/api/generated";

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

interface CommentItemProps {
  comment: CommentResponse;
  isAdmin: boolean;
  currentUserId?: number;
  onDeleteComment?: (commentId: number) => void;
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
  isAdmin,
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
    if (event.key === "Enter" && !event.shiftKey && isAdmin) {
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
      }}
    >
      <ListItem alignItems="flex-start" sx={{ pl: 0, pr: 0 }}>
        <ListItemAvatar>
          <Avatar>
            <PersonIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {comment.writer?.nickname || "익명"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {comment.createdAt ? formatDate(comment.createdAt) : ""}
              </Typography>
              {!comment.parentId && isAdmin && (
                <IconButton
                  size="small"
                  onClick={() => onReplyComment(comment.commentId!)}
                  sx={{ ml: "auto" }}
                >
                  <ReplyIcon fontSize="small" />
                </IconButton>
              )}
              {canDeleteComment && onDeleteComment && (
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
            </Box>
          }
          secondary={
            <Box>
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-wrap", mt: 1 }}
              >
                {comment.content}
              </Typography>

              {/* 대댓글 작성 폼 */}
              {isReplying && (
                <Collapse in={isReplying}>
                  <Box sx={{ mt: 2, pl: 2, borderLeft: "2px solid #1976d2" }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar sx={{ width: 32, height: 32 }}>
                        <PersonIcon />
                      </Avatar>
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
                            disabled={
                              isSubmittingReply || !newReplyContent.trim()
                            }
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
          }
        />
      </ListItem>
    </Box>
  );
};

export default function InquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const inquiryId = parseInt(params.id as string);
  const [commentContent, setCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | undefined>(undefined);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const {
    data: inquiryData,
    isLoading: inquiryLoading,
    error: inquiryError,
  } = useInquiryDetail(inquiryId);
  const { data: commentsData, isLoading: commentsLoading } =
    useInquiryComments(inquiryId);
  const createCommentMutation = useCreateInquiryComment();
  const { data: myInfoData } = useMyInfo();

  const inquiry = inquiryData?.data;
  const comments = commentsData?.data || [];
  const userRole = myInfoData?.data?.role;
  const currentUserId = myInfoData?.data?.userId;
  const isAdmin = userRole === MyInfoResponseRoleEnum.Admin;

  // 댓글을 부모 댓글과 대댓글로 분리
  const parentComments = comments.filter((comment) => !comment.parentId);
  const replyComments = comments.filter((comment) => comment.parentId);

  // 권한 체크: 관리자이거나 문의글 작성자인 경우만 접근 가능
  // API에서 작성자 정보를 제공하지 않으므로 현재는 모든 사용자 접근 허용
  const canAccess = true;

  const handleSubmitComment = async () => {
    if (!commentContent.trim() || !isAdmin) return;

    try {
      await createCommentMutation.mutateAsync({
        inquiryId,
        commentData: {
          content: commentContent.trim(),
        },
      });
      setCommentContent("");
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    }
  };

  const handleSubmitReply = async () => {
    if (!newReplyContent.trim() || !replyingTo || !isAdmin) return;

    setIsSubmittingReply(true);
    try {
      await createCommentMutation.mutateAsync({
        inquiryId,
        commentData: {
          content: newReplyContent.trim(),
          parentId: replyingTo,
        },
      });
      setNewReplyContent("");
      setReplyingTo(undefined);
    } catch (error) {
      console.error("답글 작성 실패:", error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey && isAdmin) {
      event.preventDefault();
      handleSubmitComment();
    }
  };

  const handleReplyComment = (parentId: number) => {
    setReplyingTo(parentId);
    setNewReplyContent("");
  };

  if (inquiryLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
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

  if (inquiryError || !inquiry) {
    // 403 에러인 경우 권한 없음 메시지 표시
    if (
      inquiryError &&
      typeof inquiryError === "object" &&
      "response" in inquiryError &&
      (inquiryError as any).response?.status === 403
    ) {
      return (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="error" gutterBottom>
              권한이 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              내가 등록한 문의글만 볼 수 있습니다.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/customer-service/inquiries")}
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
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            문의글을 찾을 수 없습니다
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/customer-service/inquiries")}
            sx={{ mt: 2 }}
          >
            목록으로 돌아가기
          </Button>
        </Paper>
      </Container>
    );
  }

  // 권한 체크 (현재는 모든 사용자 접근 허용, 403 에러는 위에서 처리)
  if (!canAccess) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            접근 권한이 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            내가 등록한 문의글만 볼 수 있습니다.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/customer-service/inquiries")}
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
            {isAdmin && (
              <Chip
                icon={<AdminIcon />}
                label="관리자 모드"
                color="primary"
                size="small"
              />
            )}
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
              label={comments.length > 0 ? "답변 완료" : "답변 대기"}
              color={comments.length > 0 ? "success" : "warning"}
              variant="outlined"
            />
          </Box>
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

        {/* 댓글 목록 */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <ChatIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6">댓글 ({comments.length})</Typography>
          </Box>

          {commentsLoading ? (
            <Box display="flex" justifyContent="center" py={2}>
              <CircularProgress size={24} />
            </Box>
          ) : comments.length > 0 ? (
            <List>
              {parentComments.map((comment) => {
                // 해당 부모 댓글의 대댓글들 찾기
                const replies = replyComments.filter(
                  (reply) => reply.parentId === comment.commentId
                );

                return (
                  <Box key={comment.commentId}>
                    <CommentItem
                      comment={comment}
                      isAdmin={isAdmin}
                      currentUserId={currentUserId}
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
                            isAdmin={isAdmin}
                            currentUserId={currentUserId}
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
            </List>
          ) : (
            <></>
          )}
        </Box>

        {/* 댓글 작성 (관리자만) */}
        {isAdmin && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              답변 작성
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="답변을 입력하세요..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={createCommentMutation.isPending}
              />
              <IconButton
                onClick={handleSubmitComment}
                disabled={
                  !commentContent.trim() || createCommentMutation.isPending
                }
                color="primary"
                sx={{ alignSelf: "flex-end" }}
              >
                {createCommentMutation.isPending ? (
                  <CircularProgress size={24} />
                ) : (
                  <SendIcon />
                )}
              </IconButton>
            </Box>
          </Box>
        )}

        {/* 일반 사용자에게는 답변 대기 안내 */}
        {!isAdmin && comments.length === 0 && (
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="body2">
              문의하신 내용을 검토하고 있습니다. 관리자가 답변을 작성하면 여기에
              표시됩니다.
            </Typography>
          </Alert>
        )}

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
            onClick={() => router.push("/customer-service/inquiries")}
          >
            목록으로
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
