import React, { useState, useRef } from "react";
import {
  Stack,
  Avatar,
  Box,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {
  useMyInfo,
  useUpdateMyInfo,
  useProfilePresignedUrl,
  uploadImageToS3,
} from "@/api/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/features/common/Toast";

import PointChargeDialog from "./PointChargeDialog";

const ProfileInfoTab = () => {
  const { data: myInfoData, isLoading, error } = useMyInfo();
  const updateMyInfoMutation = useUpdateMyInfo();
  const profilePresignedUrlMutation = useProfilePresignedUrl();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const myInfo = myInfoData?.data;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [pointChargeDialogOpen, setPointChargeDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    nickname: "",
    age: "",
    gender: "",
    phoneNumber: "",
    profileImage: null as File | null,
  });

  // 프로필 이미지 업로드 처리
  const handleProfileImageUpload = async (file: File) => {
    try {
      // 1. PreSigned URL 요청
      const presignedResponse = await profilePresignedUrlMutation.mutateAsync();
      const presignedUrl = presignedResponse.data?.url;

      if (!presignedUrl) {
        throw new Error("PreSigned URL을 받지 못했습니다.");
      }

      // 2. S3에 이미지 업로드
      await uploadImageToS3(file, presignedUrl);

      // 3. 프로필 정보 업데이트 (이미지 키 포함)
      const updateData = {
        nickname: myInfo?.nickname || "",
        age: myInfo?.age || undefined,
        gender: myInfo?.gender || undefined,
        phoneNumber: myInfo?.phoneNumber || "",
        profileKey: presignedResponse.data?.key || "",
      };

      await updateMyInfoMutation.mutateAsync(updateData);

      // 4. 쿼리 무효화로 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });

      showToast("프로필 이미지가 업로드되었습니다.", "success");
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      showToast("프로필 이미지 업로드에 실패했습니다.", "error");
    }
  };

  // 이미지 파일 선택 처리
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 크기 검증 (5MB 이하)
      if (file.size > 5 * 1024 * 1024) {
        showToast("파일 크기는 5MB 이하여야 합니다.", "error");
        return;
      }

      // 파일 타입 검증
      if (!file.type.startsWith("image/")) {
        showToast("이미지 파일만 업로드 가능합니다.", "error");
        return;
      }

      handleProfileImageUpload(file);
    }
  };

  // 수정 다이얼로그 열기
  const handleEditClick = () => {
    if (myInfo) {
      setEditForm({
        nickname: myInfo.nickname || "",
        age: myInfo.age?.toString() || "",
        gender: myInfo.gender || "",
        phoneNumber: myInfo.phoneNumber || "",
        profileImage: null,
      });
      setEditDialogOpen(true);
    }
  };

  // 수정 폼 제출
  const handleEditSubmit = async () => {
    try {
      const updateData = {
        nickname: editForm.nickname,
        age: editForm.age ? parseInt(editForm.age) : undefined,
        gender: editForm.gender || undefined,
        phoneNumber: editForm.phoneNumber || "",
        profileKey: myInfo?.profile || "",
      };

      await updateMyInfoMutation.mutateAsync(updateData);
      showToast("프로필 정보가 수정되었습니다.", "success");
      setEditDialogOpen(false);
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      showToast("프로필 수정에 실패했습니다.", "error");
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        내 정보를 불러오는데 실패했습니다. 다시 시도해주세요.
      </Alert>
    );
  }

  if (!myInfo) {
    return <Alert severity="info">내 정보를 찾을 수 없습니다.</Alert>;
  }

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={myInfo.profile || "/default-avatar.png"}
              sx={{
                width: 80,
                height: 80,
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
              onClick={() => fileInputRef.current?.click()}
            />
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                width: 24,
                height: 24,
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <PhotoCameraIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
          <Box flex={1}>
            <Typography variant="h5" fontWeight={700} mb={0.5}>
              {myInfo.nickname}
            </Typography>
            <Typography color="text.secondary" mb={0.5}>
              {myInfo.name} ({myInfo.email})
            </Typography>
          </Box>
          <IconButton
            onClick={handleEditClick}
            color="primary"
            sx={{ border: "1px solid", borderColor: "primary.main" }}
          >
            <EditIcon />
          </IconButton>
        </Stack>

        <Divider />
        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            기본 정보
          </Typography>
          <Stack spacing={1}>
            <Typography color="text.secondary">
              나이: {myInfo.age || "미설정"}세
            </Typography>
            <Typography color="text.secondary">
              성별:{" "}
              {myInfo.gender === "M"
                ? "남성"
                : myInfo.gender === "W"
                ? "여성"
                : "미설정"}
            </Typography>
            <Typography color="text.secondary">
              연락처: {myInfo.phoneNumber || "미설정"}
            </Typography>
            <Paper elevation={1} sx={{ p: 2, bgcolor: "grey.50" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    보유 포인트
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="primary.main"
                  >
                    {myInfo.point || 0}P
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setPointChargeDialogOpen(true)}
                  size="small"
                >
                  충전
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Stack>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        style={{ display: "none" }}
      />

      {/* 프로필 수정 다이얼로그 */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>프로필 정보 수정</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="닉네임"
              value={editForm.nickname}
              onChange={(e) =>
                setEditForm({ ...editForm, nickname: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="나이"
              type="number"
              value={editForm.age}
              onChange={(e) =>
                setEditForm({ ...editForm, age: e.target.value })
              }
              inputProps={{ min: 1, max: 100 }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>성별</InputLabel>
              <Select
                value={editForm.gender}
                label="성별"
                onChange={(e) =>
                  setEditForm({ ...editForm, gender: e.target.value })
                }
              >
                <MenuItem value="">미설정</MenuItem>
                <MenuItem value="M">남성</MenuItem>
                <MenuItem value="W">여성</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="연락처"
              value={editForm.phoneNumber}
              onChange={(e) =>
                setEditForm({ ...editForm, phoneNumber: e.target.value })
              }
              fullWidth
              placeholder="010-1234-5678"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>취소</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={
              updateMyInfoMutation.isPending || !editForm.nickname.trim()
            }
          >
            {updateMyInfoMutation.isPending ? "수정 중..." : "수정"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 포인트 충전 다이얼로그 */}
      <PointChargeDialog
        open={pointChargeDialogOpen}
        onClose={() => setPointChargeDialogOpen(false)}
        onSuccess={() => {
          setPointChargeDialogOpen(false);
          // 포인트 정보 새로고침
          queryClient.invalidateQueries({ queryKey: ["myInfo"] });
        }}
      />
    </>
  );
};

export default ProfileInfoTab;
