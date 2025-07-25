import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Person as PersonIcon,
  Star as CrownIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";

// 임시 파티원 타입
interface PartyMember {
  id: string;
  name: string;
  avatar?: string;
  isHost: boolean;
  joinedAt: Date;
  isOnline: boolean;
}

interface PartyMemberListProps {
  members: PartyMember[];
  isHost: boolean;
  onKickMember?: (memberId: string) => void;
}

const PartyMemberList: React.FC<PartyMemberListProps> = ({
  members,
  isHost,
  onKickMember,
}) => {
  const theme = useTheme();
  const [kickDialogOpen, setKickDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<PartyMember | null>(
    null
  );

  const handleKickClick = (member: PartyMember) => {
    setSelectedMember(member);
    setKickDialogOpen(true);
  };

  const handleKickConfirm = () => {
    if (selectedMember && onKickMember) {
      onKickMember(selectedMember.id);
    }
    setKickDialogOpen(false);
    setSelectedMember(null);
  };

  const handleKickCancel = () => {
    setKickDialogOpen(false);
    setSelectedMember(null);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        파티원 ({members.length}명)
      </Typography>

      <List sx={{ p: 0 }}>
        {members.map((member, index) => (
          <React.Fragment key={member.id}>
            <ListItem
              sx={{
                px: 0,
                py: 1.5,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  borderRadius: 1,
                },
              }}
              secondaryAction={
                isHost &&
                !member.isHost && (
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleKickClick(member)}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.error.light + "20",
                      },
                    }}
                  >
                    <BlockIcon />
                  </IconButton>
                )
              }
            >
              <ListItemAvatar>
                <Avatar
                  src={member.avatar}
                  sx={{
                    width: 48,
                    height: 48,
                    border: member.isOnline
                      ? `2px solid ${theme.palette.success.main}`
                      : "none",
                  }}
                >
                  {member.isHost ? (
                    <CrownIcon sx={{ color: theme.palette.warning.main }} />
                  ) : (
                    <PersonIcon />
                  )}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {member.name}
                    </Typography>
                    {member.isHost && (
                      <Chip
                        label="파티장"
                        size="small"
                        color="warning"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                    {member.isOnline && (
                      <Chip
                        label="온라인"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    참여일: {dayjs(member.joinedAt).format("M월 D일")}
                  </Typography>
                }
              />
            </ListItem>

            {index < members.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>

      {/* 강퇴 확인 다이얼로그 */}
      <Dialog
        open={kickDialogOpen}
        onClose={handleKickCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>파티원 강퇴</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            <strong>{selectedMember?.name}</strong>님을 파티에서
            강퇴하시겠습니까?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            강퇴된 파티원은 다시 참여할 수 없으며, 이 작업은 되돌릴 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleKickCancel} color="inherit">
            취소
          </Button>
          <Button onClick={handleKickConfirm} color="error" variant="contained">
            강퇴
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartyMemberList;
