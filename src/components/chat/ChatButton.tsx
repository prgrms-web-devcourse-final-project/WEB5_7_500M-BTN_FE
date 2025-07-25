import React from "react";
import { IconButton, Badge, Tooltip, useTheme } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { styled } from "@mui/material/styles";

interface ChatButtonProps {
  onClick: () => void;
  unreadCount?: number;
  size?: "small" | "medium" | "large";
  variant?: "icon" | "button";
  disabled?: boolean;
}

const StyledChatButton = styled(IconButton)(({ theme }) => ({
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[4],
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const ChatButton: React.FC<ChatButtonProps> = ({
  onClick,
  unreadCount = 0,
  size = "medium",
  variant = "icon",
  disabled = false,
}) => {
  const theme = useTheme();

  const getSize = () => {
    switch (size) {
      case "small":
        return { width: 32, height: 32 };
      case "large":
        return { width: 48, height: 48 };
      default:
        return { width: 40, height: 40 };
    }
  };

  return (
    <Tooltip title="채팅방 열기" placement="top">
      <StyledChatButton
        onClick={onClick}
        disabled={disabled}
        sx={{
          ...getSize(),
          bgcolor: theme.palette.primary.main,
          color: "white",
          "&:hover": {
            bgcolor: theme.palette.primary.dark,
          },
          "&:disabled": {
            bgcolor: theme.palette.grey[300],
            color: theme.palette.grey[500],
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={99}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.75rem",
              height: "18px",
              minWidth: "18px",
            },
          }}
        >
          <ChatIcon fontSize={size === "small" ? "small" : "medium"} />
        </Badge>
      </StyledChatButton>
    </Tooltip>
  );
};

export default ChatButton;
