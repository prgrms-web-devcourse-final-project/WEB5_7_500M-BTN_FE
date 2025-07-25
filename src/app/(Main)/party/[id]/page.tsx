"use client";
import React, { useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
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
import {
  usePartyDetail,
  useJoinParty,
  useQuitParty,
  useMyInfo,
  useMyParties,
} from "@/api/hooks";
import { useToast } from "@/features/common/Toast";
import Toast from "@/features/common/Toast";
import { useAuth } from "@/hooks/useAuth";
import ChatButton from "@/components/chat/ChatButton";
import ChatRoom from "@/components/chat/ChatRoom";
import PartyMemberList from "@/components/party/PartyMemberList";
import { getUnreadCount } from "@/data/mockChatData";
import { getPartyMembers, kickPartyMember } from "@/data/mockPartyMembers";
import type { PartyDetailResponse } from "@/api/generated";

dayjs.locale("ko");

const PartyDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const partyId = Array.isArray(params.id) ? params.id[0] : params.id;
  const numericPartyId = parseInt(partyId || "0", 10);

  const { data: partyData, isLoading, error } = usePartyDetail(numericPartyId);
  const { data: myInfoData } = useMyInfo();
  const { data: myPartiesData } = useMyParties();
  const joinPartyMutation = useJoinParty();
  const quitPartyMutation = useQuitParty();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  const party = partyData?.data;
  const myInfo = myInfoData?.data;
  const myParties = myPartiesData?.data?.content || [];

  // 댓글 관련 상태 (임시로 로컬 상태로 관리)
  const [newComment, setNewComment] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [partyMembers, setPartyMembers] = useState(() =>
    getPartyMembers(partyId || "")
  );

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !party) {
    return (
      <Box maxWidth={800} mx="auto" px={3} py={6}>
        <Alert severity="error">파티 정보를 불러오는데 실패했습니다.</Alert>
      </Box>
    );
  }

  const isHost = myInfo?.userId === party.hostId;
  // 임시로 참여 상태 확인 (실제 API 데이터가 없을 때는 임시로 참여한 것으로 처리)
  const isJoined =
    myParties.some((myParty) => myParty.partyId === party.partyId) ||
    (party?.partyId && party.partyId <= 3); // 임시 파티 ID 1, 2, 3은 참여한 것으로 처리

  const handleJoinParty = async () => {
    if (!isAuthenticated) {
      showToast("로그인이 필요합니다.", "warning");
      return;
    }

    try {
      await joinPartyMutation.mutateAsync(numericPartyId);
      showToast("파티에 참여했습니다!", "success");
    } catch (error) {
      // 에러는 이미 useJoinParty 훅에서 자동으로 처리됨
    }
  };

  const handleQuitParty = async () => {
    try {
      await quitPartyMutation.mutateAsync(numericPartyId);
      showToast("파티에서 나갔습니다.", "success");
    } catch (error) {
      // 에러는 이미 useQuitParty 훅에서 자동으로 처리됨
    }
  };

  const handleKickMember = (memberId: string) => {
    const updatedMembers = kickPartyMember(partyId || "", memberId);
    setPartyMembers(updatedMembers);
    showToast("파티원을 강퇴했습니다.", "success");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECRUITING":
        return "primary";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "RECRUITING":
        return "모집중";
      case "COMPLETED":
        return "모집완료";
      case "CANCELLED":
        return "취소됨";
      default:
        return status;
    }
  };

  const getGenderConditionLabel = (gender: string) => {
    switch (gender) {
      case "W":
        return "여성";
      case "M":
        return "남성";
      case "A":
        return "무관";
      default:
        return gender;
    }
  };

  const mapCenter = party.shopRoadAddress
    ? { lat: 37.566826, lng: 126.9786567 }
    : undefined;

  return (
    <>
      <Box maxWidth={800} mx="auto" px={3} py={6}>
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            alignItems="flex-start"
          >
            <Box flex={1}>
              {party.shopImage ? (
                <img
                  src={party.shopImage}
                  alt={party.shopName}
                  style={{
                    width: "100%",
                    maxWidth: 320,
                    borderRadius: 12,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 320,
                    height: 200,
                    bgcolor: "grey.200",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="text.secondary">이미지 없음</Typography>
                </Box>
              )}
            </Box>
            <Box flex={2}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Typography variant="h4" fontWeight={700}>
                  {party.title}
                </Typography>
                <Chip
                  label={getStatusLabel(party.status || "")}
                  color={getStatusColor(party.status || "") as any}
                  size="small"
                />
              </Stack>
              <Typography variant="subtitle1" color="text.secondary" mb={2}>
                {party.shopName} | {party.shopRoadAddress}{" "}
                {party.shopDetailAddress}
              </Typography>
              <Stack direction="row" spacing={1} mb={2}>
                <Chip
                  label={dayjs(party.metAt).format(
                    "YYYY년 MM월 DD일 dddd A h:mm"
                  )}
                />
                <Chip label={`인원: ${party.currentCount}/${party.maxCount}`} />
              </Stack>
              <Typography variant="body1" mb={2}>
                {party.description || "함께 맛집을 탐험할 멤버를 모집합니다!"}
              </Typography>

              {/* 파티원 목록 */}
              <Box sx={{ mb: 3 }}>
                <PartyMemberList
                  members={partyMembers}
                  isHost={isHost}
                  onKickMember={handleKickMember}
                />
              </Box>

              <Divider sx={{ my: 2 }} />
              <Stack spacing={1} mb={2}>
                <Typography variant="body2" color="text.secondary">
                  최소 인원: {party.minCount}명
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  현재 인원: {party.currentCount}명
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  최대 인원: {party.maxCount}명
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  성별 조건:{" "}
                  {getGenderConditionLabel(party.genderCondition || "")}
                </Typography>
                {party.minAge && party.maxAge && (
                  <Typography variant="body2" color="text.secondary">
                    나이 조건: {party.minAge}세 ~ {party.maxAge}세
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  모집 마감:{" "}
                  {dayjs(party.deadline).format("YYYY년 MM월 DD일 dddd A h:mm")}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} mt={2}>
                {!isHost && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={party.status !== "RECRUITING"}
                    onClick={isJoined ? handleQuitParty : handleJoinParty}
                  >
                    {isJoined ? "파티 나가기" : "파티 참여하기"}
                  </Button>
                )}
                {isHost && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    fullWidth
                    disabled={party.status !== "RECRUITING"}
                    onClick={() => {
                      // 파티 삭제 로직 (추후 구현)
                      showToast("파티 삭제 기능은 추후 구현됩니다.", "info");
                    }}
                  >
                    파티 삭제
                  </Button>
                )}
                {isJoined && (
                  <ChatButton
                    onClick={() => setShowChat(true)}
                    size="large"
                    unreadCount={getUnreadCount(
                      party.partyId?.toString() || ""
                    )}
                  />
                )}
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {mapCenter && (
          <>
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
          </>
        )}

        {/* 댓글 영역 - 임시로 비활성화 */}
        <Paper elevation={1} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            댓글
          </Typography>
          <Typography color="text.secondary" textAlign="center" py={4}>
            댓글 기능은 준비 중입니다.
          </Typography>
        </Paper>
      </Box>

      {/* 채팅방 모달 */}
      {showChat && (
        <ChatRoom
          party={{
            id: party.partyId?.toString() || "",
            title: party.title || "",
            shopName: party.shopName || "",
            currentCount: party.currentCount || 0,
            maxCount: party.maxCount || 0,
            metAt: new Date(party.metAt || ""),
            status:
              (party.status === "TERMINATED" ? "COMPLETED" : party.status) ||
              "RECRUITING",
          }}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
};

export default PartyDetailPage;
