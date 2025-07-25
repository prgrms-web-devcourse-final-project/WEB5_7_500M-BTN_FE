import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Stack,
  Divider,
  Chip,
  Badge,
  useTheme,
  Fade,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import type { ChatMessage, PartyInfo } from "@/types/chat";
import { getChatMessages } from "@/data/mockChatData";

dayjs.locale("ko");

interface ChatRoomProps {
  party: PartyInfo;
  onClose: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ party, onClose }) => {
  const theme = useTheme();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getChatMessages(party.id)
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message.trim(),
      sender: {
        id: "me",
        name: "나",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      timestamp: new Date(),
      isMyMessage: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return dayjs(date).format("M월 D일 A h:mm");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1300,
        bgcolor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Fade in={true}>
        <Paper
          elevation={24}
          sx={{
            width: "100%",
            maxWidth: 600,
            height: "100%",
            maxHeight: 700,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* 헤더 */}
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <IconButton onClick={onClose} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Box flex={1}>
              <Typography variant="h6" fontWeight={600} noWrap>
                {party.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {party.shopName} • {party.currentCount}/{party.maxCount}명
              </Typography>
            </Box>
            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* 메시지 영역 */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              bgcolor: theme.palette.grey[50],
              p: 2,
            }}
          >
            <Stack spacing={2}>
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: "flex",
                    justifyContent: msg.isMyMessage ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "70%",
                      display: "flex",
                      flexDirection: msg.isMyMessage ? "row-reverse" : "row",
                      alignItems: "flex-end",
                      gap: 1,
                    }}
                  >
                    {!msg.isMyMessage && (
                      <Avatar
                        src={msg.sender.avatar}
                        sx={{ width: 32, height: 32 }}
                      >
                        {msg.sender.name.charAt(0)}
                      </Avatar>
                    )}
                    <Box>
                      {!msg.isMyMessage && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 1, mb: 0.5, display: "block" }}
                        >
                          {msg.sender.name}
                        </Typography>
                      )}
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          bgcolor: msg.isMyMessage
                            ? theme.palette.primary.main
                            : theme.palette.background.paper,
                          color: msg.isMyMessage
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.primary,
                          borderRadius: 2,
                          borderTopLeftRadius: msg.isMyMessage ? 2 : 0,
                          borderTopRightRadius: msg.isMyMessage ? 0 : 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ wordBreak: "break-word" }}
                        >
                          {msg.content}
                        </Typography>
                      </Paper>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
                          display: "block",
                          textAlign: msg.isMyMessage ? "right" : "left",
                        }}
                      >
                        {formatTime(msg.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Stack>
          </Box>

          {/* 입력 영역 */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="메시지를 입력하세요..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!message.trim()}
                color="primary"
                sx={{
                  bgcolor: message.trim() ? "primary.main" : "grey.300",
                  color: message.trim() ? "white" : "grey.500",
                  "&:hover": {
                    bgcolor: message.trim() ? "primary.dark" : "grey.300",
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default ChatRoom;
