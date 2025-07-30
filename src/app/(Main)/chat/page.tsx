"use client";

import React from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import ChatList from "@/components/chat/ChatList";
import { useMyParties } from "@/api/hooks";

const ChatPage = () => {
  const { data: myPartiesData, isLoading, error } = useMyParties();
  const myParties = myPartiesData?.data?.content || [];

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

  if (error) {
    return (
      <Box maxWidth={800} mx="auto" px={3} py={6}>
        <Alert severity="error">
          채팅방 목록을 불러오는데 실패했습니다. 다시 시도해주세요.
        </Alert>
      </Box>
    );
  }

  return (
    <Box maxWidth={800} mx="auto" px={3} py={6}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        채팅방
      </Typography>
      <ChatList parties={myParties} />
    </Box>
  );
};

export default ChatPage;
