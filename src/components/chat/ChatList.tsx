import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Badge,
  Divider,
  Stack,
  useTheme,
  Fade,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import ChatRoom from "./ChatRoom";
import type { MyPartyResponse } from "@/api/generated";
import type { ChatRoomInfo } from "@/types/chat";
import { getChatRoomInfo } from "@/data/mockChatData";

dayjs.locale("ko");

interface ChatListProps {
  parties: MyPartyResponse[];
}

const ChatList: React.FC<ChatListProps> = ({ parties }) => {
  const theme = useTheme();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const handleChatClick = (partyId: string) => {
    setSelectedChat(partyId);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return dayjs(date).format("M월 D일");
  };

  const getStatusColor = (party: MyPartyResponse) => {
    const now = dayjs();
    const isPast = dayjs(party.metAt).isBefore(now, "minute");

    if (isPast) return "default";
    if (
      party.currentCount &&
      party.maxCount &&
      party.currentCount >= party.maxCount
    ) {
      return "error";
    }
    return "primary";
  };

  const getStatusLabel = (party: MyPartyResponse) => {
    const now = dayjs();
    const isPast = dayjs(party.metAt).isBefore(now, "minute");

    if (isPast) return "종료";
    if (
      party.currentCount &&
      party.maxCount &&
      party.currentCount >= party.maxCount
    ) {
      return "마감";
    }
    return "모집중";
  };

  if (parties.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          textAlign: "center",
        }}
      >
        <ChatIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          참여한 파티가 없습니다
        </Typography>
        <Typography variant="body2" color="text.secondary">
          파티에 참여하면 채팅방을 이용할 수 있습니다
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" fontWeight={600}>
            채팅방 목록
          </Typography>
          <Typography variant="body2" color="text.secondary">
            참여한 파티의 채팅방입니다
          </Typography>
        </Box>

        <List sx={{ p: 0 }}>
          {parties.map((party, index) => {
            const chatInfo = getChatRoomInfo(party.partyId?.toString() || "");
            const isLast = index === parties.length - 1;

            return (
              <React.Fragment key={party.partyId}>
                <ListItem
                  component="div"
                  onClick={() =>
                    handleChatClick(party.partyId?.toString() || "")
                  }
                  sx={{
                    p: 2,
                    transition: "all 0.2s ease-in-out",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      badgeContent={chatInfo?.onlineCount || 0}
                      color="success"
                      max={99}
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: "0.6rem",
                          height: "16px",
                          minWidth: "16px",
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          width: 48,
                          height: 48,
                        }}
                      >
                        <RestaurantIcon />
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle1" fontWeight={600} noWrap>
                          {party.title}
                        </Typography>
                        <Chip
                          label={getStatusLabel(party)}
                          color={getStatusColor(party) as any}
                          size="small"
                          sx={{ fontSize: "0.7rem" }}
                        />
                      </Stack>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {party.shopName}
                        </Typography>
                        {chatInfo && (
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mt={0.5}
                          >
                            <Typography
                              variant="body2"
                              color="text.primary"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: 200,
                              }}
                            >
                              {chatInfo.lastMessage}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatLastMessageTime(chatInfo.lastMessageTime)}
                            </Typography>
                          </Stack>
                        )}
                      </Box>
                    }
                  />

                  <Stack alignItems="flex-end" spacing={1}>
                    {chatInfo && chatInfo.unreadCount > 0 && (
                      <Badge
                        badgeContent={chatInfo.unreadCount}
                        color="error"
                        max={99}
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: "0.7rem",
                            height: "18px",
                            minWidth: "18px",
                          },
                        }}
                      >
                        <ChatIcon color="primary" />
                      </Badge>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {party.currentCount}/{party.maxCount}명
                    </Typography>
                  </Stack>
                </ListItem>

                {!isLast && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      </Paper>

      {/* 채팅방 모달 */}
      {selectedChat && (
        <ChatRoom
          party={{
            id: selectedChat,
            title:
              parties.find((p) => p.partyId?.toString() === selectedChat)
                ?.title || "",
            shopName:
              parties.find((p) => p.partyId?.toString() === selectedChat)
                ?.shopName || "",
            currentCount:
              parties.find((p) => p.partyId?.toString() === selectedChat)
                ?.currentCount || 0,
            maxCount:
              parties.find((p) => p.partyId?.toString() === selectedChat)
                ?.maxCount || 0,
            metAt: new Date(
              parties.find((p) => p.partyId?.toString() === selectedChat)
                ?.metAt || ""
            ),
            status: "RECRUITING",
          }}
          onClose={handleCloseChat}
        />
      )}
    </>
  );
};

export default ChatList;
