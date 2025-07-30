import React, { useState } from "react";
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
import { useMyInfo, useUpdateMyInfo } from "@/api/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/features/common/Toast";
import Toast from "@/features/common/Toast";
import PointChargeDialog from "./PointChargeDialog";

const ProfileInfoTab = () => {
  const { data: myInfoData, isLoading, error } = useMyInfo();
  const updateMyInfoMutation = useUpdateMyInfo();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const myInfo = myInfoData?.data;

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [pointChargeDialogOpen, setPointChargeDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    nickname: "",
    age: "",
    gender: "",
    phoneNumber: "",
  });

  // 수정 다이얼로그 열기
  const handleEditClick = () => {
    if (myInfo) {
      setEditForm({
        nickname: myInfo.nickname || "",
        age: myInfo.age?.toString() || "",
        gender: myInfo.gender || "",
        phoneNumber: myInfo.phoneNumber || "",
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
          <Avatar
            src={myInfo.profile || "/default-avatar.png"}
            sx={{ width: 80, height: 80 }}
          />
          <Box flex={1}>
            <Typography variant="h5" fontWeight={700} mb={0.5}>
              {myInfo.nickname}
            </Typography>
            <Typography color="text.secondary" mb={0.5}>
              {myInfo.name} ({myInfo.email})
            </Typography>
            <Chip label="맛집 탐험가" color="primary" size="small" />
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
            내 소개
          </Typography>
          <Typography color="text.secondary">
            안녕하세요! 맛집 탐험을 좋아하는 {myInfo.nickname}입니다. 다양한
            사람들과 함께 식사하는 걸 즐깁니다.
          </Typography>
        </Box>
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
