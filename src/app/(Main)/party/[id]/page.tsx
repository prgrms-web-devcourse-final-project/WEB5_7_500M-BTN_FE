"use client";
import React from "react";
import { useParams, notFound } from "next/navigation";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { simpleParties } from "@/mock/party";
import { partyComments, PartyComment } from "@/mock/party";
import { simpleUsers } from "@/mock/user";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import KakaoMap from "../KakaoMap";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

const PartyDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const party = simpleParties.find((p) => p.id === id);

  if (!party) return notFound();

  const shop = party.shop;
  const mapCenter = { lat: 37.566826, lng: 126.9786567 };
  // 실제 좌표가 없으므로 기본값 사용, 실제 서비스에서는 shop에 좌표 필드 필요

  const [comments, setComments] = React.useState<PartyComment[]>(
    partyComments[id] || []
  );
  const [newComment, setNewComment] = React.useState("");
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editContent, setEditContent] = React.useState("");
  // 임시: 로그인 유저 mock (실제 서비스에서는 context 등 활용)
  const currentUser = simpleUsers[0];

  // 댓글 작성
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const now = new Date().toISOString();
    const comment: PartyComment = {
      id: `c${Date.now()}`,
      partyId: id,
      author: currentUser,
      content: newComment,
      createdAt: now,
      updatedAt: now,
    };
    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  // 댓글 삭제
  const handleDelete = (cid: string) => {
    setComments((prev) => prev.filter((c) => c.id !== cid));
  };

  // 댓글 수정 시작
  const handleEditStart = (cid: string, content: string) => {
    setEditId(cid);
    setEditContent(content);
  };
  // 댓글 수정 취소
  const handleEditCancel = () => {
    setEditId(null);
    setEditContent("");
  };
  // 댓글 저장
  const handleEditSave = (cid: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === cid
          ? { ...c, content: editContent, updatedAt: new Date().toISOString() }
          : c
      )
    );
    setEditId(null);
    setEditContent("");
  };

  return (
    <Box maxWidth={800} mx="auto" px={3} py={6}>
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          alignItems="flex-start"
        >
          <Box flex={1}>
            <img
              src={shop.thumbnail}
              alt={shop.name}
              style={{
                width: "100%",
                maxWidth: 320,
                borderRadius: 12,
                objectFit: "cover",
              }}
            />
          </Box>
          <Box flex={2}>
            <Typography variant="h4" fontWeight={700} mb={1}>
              {party.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={2}>
              {shop.name} | {shop.address}
            </Typography>
            <Stack direction="row" spacing={1} mb={2}>
              <Chip
                label={dayjs(party.dateTime).format(
                  "YYYY년 MM월 DD일 dddd A h:mm"
                )}
              />
              <Chip
                label={`인원: ${party.currentUserCount}/${party.maxUserCount}`}
              />
            </Stack>
            <Typography variant="body1" mb={2}>
              함께 맛집을 탐험할 멤버를 모집합니다!
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Typography variant="body2" color="text.secondary">
                최소 인원: {party.minUserCount}명
              </Typography>
              <Typography variant="body2" color="text.secondary">
                현재 인원: {party.currentUserCount}명
              </Typography>
              <Typography variant="body2" color="text.secondary">
                최대 인원: {party.maxUserCount}명
              </Typography>
            </Stack>
            <Button variant="contained" color="primary" size="large" fullWidth>
              파티 참여하기
            </Button>
          </Box>
        </Stack>
      </Paper>
      <Typography variant="h6" fontWeight={700} mb={2}>
        위치 정보
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: 400,
          borderRadius: 2,
          overflow: "hidden",
          mb: 4,
        }}
      >
        <KakaoMap center={mapCenter} marker={mapCenter} zoomLevel={3} />
      </Box>
      {/* 댓글 영역 */}
      <Paper elevation={1} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          댓글
        </Typography>
        {/* 댓글 작성 */}
        <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
          <Avatar src={currentUser.profileImage} alt={currentUser.nickname} />
          <TextField
            multiline
            minRows={2}
            maxRows={6}
            fullWidth
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddComment}
            sx={{ minWidth: 100 }}
          >
            등록
          </Button>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {/* 댓글 목록 */}
        <Stack spacing={2}>
          {comments.length === 0 && (
            <Typography color="text.secondary">
              아직 댓글이 없습니다.
            </Typography>
          )}
          {comments.map((c) => (
            <Stack
              key={c.id}
              direction="row"
              spacing={2}
              alignItems="flex-start"
            >
              <Avatar src={c.author.profileImage} alt={c.author.nickname} />
              <Box flex={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography fontWeight={600}>{c.author.nickname}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(c.createdAt).format("YYYY.MM.DD HH:mm")}
                  </Typography>
                  {c.updatedAt !== c.createdAt && (
                    <Typography variant="caption" color="info.main">
                      (수정됨)
                    </Typography>
                  )}
                </Stack>
                {editId === c.id ? (
                  <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                    <TextField
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      size="small"
                      fullWidth
                      multiline
                      minRows={1}
                      maxRows={6}
                    />
                    <IconButton
                      onClick={() => handleEditSave(c.id)}
                      color="primary"
                    >
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={handleEditCancel} color="inherit">
                      <CancelIcon />
                    </IconButton>
                  </Stack>
                ) : (
                  <Typography variant="body2" mt={1} whiteSpace="pre-line">
                    {c.content}
                  </Typography>
                )}
              </Box>
              {/* 본인 댓글만 수정/삭제 */}
              {c.author.id === currentUser.id && editId !== c.id && (
                <Stack direction="row" spacing={1}>
                  <IconButton
                    onClick={() => handleEditStart(c.id, c.content)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(c.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              )}
            </Stack>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};

export default PartyDetailPage;
