import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Rating,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
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

const categoryIcons: Record<string, string> = {
  한식: "🍚",
  일식: "🍣",
  중식: "🥟",
  양식: "🍝",
  기타: "🍽️",
};

const PartyItem = ({ party }: PartyItemProps) => {
  const theme = useTheme();
  const status = getStatus(party);
  const isPast = status.label === "종료";

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "stretch",
        boxShadow: 2,
        borderRadius: 3,
        opacity: isPast ? 0.5 : 1,
        filter: isPast ? "grayscale(0.2)" : "none",
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": {
          boxShadow: 6,
          transform: isPast ? undefined : "scale(1.02)",
        },
        minHeight: 120,
        mb: 2,
      }}
    >
      <CardMedia
        component="img"
        image="/default-shop-image.jpg"
        alt={party.shopName || "식당"}
        sx={{
          width: { xs: "100%", sm: 120 },
          height: { xs: 140, sm: "auto" },
          objectFit: "cover",
          borderRadius: { xs: "12px 12px 0 0", sm: "12px 0 0 12px" },
        }}
      />
      <CardContent
        sx={{
          flex: 1,
          p: 2,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
            <Typography fontWeight={700} fontSize={18} noWrap>
              {party.title}
            </Typography>
            <Chip
              icon={status.icon}
              label={status.label}
              color={status.color as any}
              size="small"
              sx={{ fontWeight: 700 }}
            />
            <Chip
              label={dayjs(party.metAt).format("M월 D일 ddd A h:mm")}
              size="small"
              color="default"
              sx={{ ml: 0.5 }}
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {party.shopName}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" noWrap mb={1}>
            주소 정보 없음
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
            <Chip
              label={`인원: ${party.currentCount || 0}/${party.maxCount || 0}`}
              size="small"
              color="info"
            />
            <Typography variant="caption" color="text.secondary">
              (최소 {party.minCount || 0}명)
            </Typography>
          </Stack>
          {party.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              mt={1}
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {party.description}
            </Typography>
          )}
        </Box>
        <Button
          href={`/party/${party.partyId}`}
          variant="contained"
          size="small"
          sx={{
            alignSelf: "flex-end",
            mt: 2,
            borderRadius: 2,
            fontWeight: 600,
            boxShadow: "none",
            textTransform: "none",
          }}
          disabled={isPast}
        >
          상세보기
        </Button>
      </CardContent>
    </Card>
  );
};

export default PartyItem;
