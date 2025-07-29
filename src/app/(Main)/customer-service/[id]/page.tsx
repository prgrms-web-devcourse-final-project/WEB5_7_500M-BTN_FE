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
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Chat as ChatIcon,
  Send as SendIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import {
  useInquiryDetail,
  useInquiryComments,
  useCreateInquiryComment,
  useMyInfo,
} from "@/api/hooks";
import { MyInfoResponseRoleEnum } from "@/api/generated";

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
  const [commentContent, setCommentContent] = useState("");

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

  // TODO: API에서 문의글 작성자 정보를 제공한다면 여기서 권한 체크
  // const canAccess = isAdmin || inquiry?.writerId === currentUserId;
  const canAccess = true; // 현재는 모든 사용자가 접근 가능하도록 설정

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

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey && isAdmin) {
      event.preventDefault();
      handleSubmitComment();
    }
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

  // 권한 체크 (현재는 모든 사용자 접근 허용)
  if (!canAccess) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            접근 권한이 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            다른 사용자의 문의글은 볼 수 없습니다.
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
            {!isAdmin && (
              <Alert severity="info" icon={<WarningIcon />} sx={{ flex: 1 }}>
                <Typography variant="body2">
                  관리자만 답변을 작성할 수 있습니다.
                </Typography>
              </Alert>
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
              {comments.map((comment) => (
                <ListItem key={comment.commentId} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          {comment.writer?.nickname || "익명"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {comment.createdAt
                            ? formatDate(comment.createdAt)
                            : ""}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap", mt: 1 }}
                      >
                        {comment.content}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              <Typography variant="body2">
                아직 댓글이 없습니다.
                {isAdmin
                  ? " 답변을 작성해보세요!"
                  : " 관리자가 답변을 기다리고 있습니다."}
              </Typography>
            </Alert>
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
