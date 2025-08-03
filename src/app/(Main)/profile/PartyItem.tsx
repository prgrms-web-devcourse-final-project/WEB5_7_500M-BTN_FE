import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import dayjs from "dayjs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ChatButton from "@/components/chat/ChatButton";
import ChatRoom from "@/components/chat/ChatRoom";
import { useQuitParty } from "@/api/hooks";
import { useToast } from "@/features/common/Toast";
import type { MyPartyResponse } from "@/api/generated";

interface PartyItemProps {
  party: MyPartyResponse;
}

const getStatus = (party: MyPartyResponse) => {
  const now = dayjs();
  const isPast = dayjs(party.metAt).isBefore(now, "minute");
  if (isPast)
    return {
      label: "종료",
      color: "default",
      icon: <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />,
    };
  if (
    party.currentCount &&
    party.maxCount &&
    party.currentCount >= party.maxCount
  )
    return {
      label: "마감",
      color: "error",
      icon: <LockIcon fontSize="small" sx={{ mr: 0.5 }} />,
    };
  return {
    label: "모집중",
    color: "primary",
    icon: <HourglassEmptyIcon fontSize="small" sx={{ mr: 0.5 }} />,
  };
};

const PartyItem = ({ party }: PartyItemProps) => {
  const status = getStatus(party);
  const isPast = status.label === "종료";
  const [showChat, setShowChat] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const quitPartyMutation = useQuitParty();
  const { showToast } = useToast();

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "stretch",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: 3,
          opacity: isPast ? 0.6 : 1,
          filter: isPast ? "grayscale(0.3)" : "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: isPast
              ? "0 2px 8px rgba(0,0,0,0.1)"
              : "0 8px 24px rgba(0,0,0,0.15)",
            transform: isPast ? "none" : "translateY(-2px)",
          },
          minHeight: 140,
          mb: 2,
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            p: 3,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            "&:last-child": { pb: 3 },
          }}
        >
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              mb={1.5}
              sx={{
                flexWrap: { xs: "wrap", sm: "nowrap" },
                gap: { xs: 1, sm: 1.5 },
              }}
            >
              <Typography
                fontWeight={700}
                fontSize={{ xs: 16, sm: 18 }}
                noWrap
                sx={{
                  color: "text.primary",
                  flex: { sm: 1 },
                  minWidth: 0,
                }}
              >
                {party.title}
              </Typography>
              <Chip
                icon={status.icon}
                label={status.label}
                color={status.color as any}
                size="small"
                sx={{
                  fontWeight: 700,
                  "&.MuiChip-colorPrimary": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                  "&.MuiChip-colorError": {
                    backgroundColor: "error.main",
                    color: "white",
                  },
                  "&.MuiChip-colorDefault": {
                    backgroundColor: "grey.300",
                    color: "text.primary",
                  },
                }}
              />
              <Chip
                label={dayjs(party.metAt).format("M월 D일 ddd A h:mm")}
                size="small"
                color="default"
                sx={{
                  ml: { xs: 0, sm: 0.5 },
                  backgroundColor: "grey.100",
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              mb={1}
              sx={{
                "& .MuiTypography-root": {
                  color: "text.secondary",
                  fontWeight: 500,
                },
              }}
            >
              <Typography variant="body2" color="text.secondary" noWrap>
                {party.shopName}
              </Typography>
            </Stack>
            {/* <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              mb={1.5}
              sx={{
                fontSize: "0.875rem",
                opacity: 0.7,
              }}
            >
              {party.}
            </Typography> */}
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              mt={0.5}
              sx={{
                "& .MuiChip-root": {
                  fontWeight: 600,
                },
              }}
            >
              <Chip
                label={`인원: ${party.currentCount || 0}/${
                  party.maxCount || 0
                }`}
                size="small"
                color="info"
                sx={{
                  backgroundColor: "info.light",
                  color: "info.contrastText",
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: "0.75rem",
                  opacity: 0.8,
                }}
              >
                (최소 {party.minCount || 0}명)
              </Typography>
            </Stack>
            {party.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                mt={1.5}
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.5,
                  opacity: 0.8,
                }}
              >
                {party.description}
              </Typography>
            )}
          </Box>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignSelf: "flex-end",
              mt: 2,
              "& .MuiButton-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.5, sm: 0.75 },
              },
            }}
          >
            <ChatButton
              onClick={() => setShowChat(true)}
              size="small"
              unreadCount={0}
              disabled={isPast}
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => setShowQuitDialog(true)}
              disabled={isPast}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                borderColor: "error.main",
                color: "error.main",
                "&:hover": {
                  backgroundColor: "error.light",
                  borderColor: "error.dark",
                },
                "&:disabled": {
                  borderColor: "grey.300",
                  color: "grey.400",
                },
              }}
            >
              나가기
            </Button>
            <Button
              href={`/party/${party.partyId}`}
              variant="contained"
              size="small"
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: "none",
                textTransform: "none",
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                },
                "&:disabled": {
                  backgroundColor: "grey.300",
                  color: "grey.500",
                },
              }}
              disabled={isPast}
            >
              상세보기
            </Button>
          </Stack>
        </CardContent>
      </Card>
      {showChat && (
        <ChatRoom
          party={{
            id: party.partyId?.toString() || "",
            title: party.title || "",
            shopName: party.shopName || "",
            currentCount: party.currentCount || 0,
            maxCount: party.maxCount || 0,
            metAt: new Date(party.metAt || ""),
            status: "RECRUITING",
          }}
          onClose={() => setShowChat(false)}
        />
      )}
      <Dialog
        open={showQuitDialog}
        onClose={() => setShowQuitDialog(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: "1.25rem",
            pb: 1,
          }}
        >
          파티 나가기
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              fontWeight: 500,
              mb: 2,
            }}
          >
            <strong>{party.title}</strong> 파티에서 나가시겠습니까?
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.6,
              opacity: 0.8,
            }}
          >
            파티를 나가면 다시 참여할 수 없으며, 채팅 기록도 삭제됩니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setShowQuitDialog(false)}
            color="inherit"
            sx={{
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            취소
          </Button>
          <Button
            onClick={async () => {
              try {
                await quitPartyMutation.mutateAsync(party.partyId || 0);
                showToast("파티에서 나갔습니다.", "success");
                setShowQuitDialog(false);
              } catch (error: any) {
                if (error?.response?.data?.message) {
                  showToast(error.response.data.message, "error");
                } else {
                  showToast("파티 나가기에 실패했습니다.", "error");
                }
              }
            }}
            color="error"
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "error.main",
              "&:hover": {
                backgroundColor: "error.dark",
              },
            }}
          >
            나가기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PartyItem;
