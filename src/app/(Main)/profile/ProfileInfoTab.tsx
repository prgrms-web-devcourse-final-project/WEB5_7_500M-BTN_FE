import React from "react";
import { Stack, Avatar, Box, Typography, Chip, Divider } from "@mui/material";
import { simpleUsers } from "@/mock/user";

const currentUser = simpleUsers[0];

const ProfileInfoTab = () => (
  <Stack spacing={3}>
    <Stack direction="row" spacing={3} alignItems="center">
      <Avatar src={currentUser.profileImage} sx={{ width: 80, height: 80 }} />
      <Box>
        <Typography variant="h5" fontWeight={700} mb={0.5}>
          {currentUser.nickname}
        </Typography>
        <Typography color="text.secondary" mb={0.5}>
          {currentUser.name} ({currentUser.username})
        </Typography>
        <Chip label="맛집 탐험가" color="primary" size="small" />
      </Box>
    </Stack>
    <Divider />
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        내 소개
      </Typography>
      <Typography color="text.secondary">
        안녕하세요! 맛집 탐험을 좋아하는 {currentUser.nickname}입니다. 다양한
        사람들과 함께 식사하는 걸 즐깁니다.
      </Typography>
    </Box>
  </Stack>
);

export default ProfileInfoTab;
