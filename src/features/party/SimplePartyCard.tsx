import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { SimpleParty } from "@/mock/party";

type SimplePartyCardProps = {
  party: SimpleParty;
};

dayjs.locale("ko");

const SimplePartyCard = ({ party }: SimplePartyCardProps) => {
  return (
    <Card sx={{ p: 2, height: "100%" }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          pb: "16px !important",
        }}
      >
        <Typography variant="h6" fontWeight={600} noWrap mb={1}>
          {party.name}
        </Typography>
        <Stack spacing={0.5} mb={2}>
          <Typography variant="subtitle1" fontWeight={500}>
            {party.shop.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {party.shop.address}
          </Typography>
        </Stack>
        <Stack spacing={0.5} mb={2}>
          <Typography variant="subtitle1" fontWeight={500}>
            탐험 시간
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dayjs(party.dateTime).format("YYYY년 MM월 DD일 dddd A h:mm")}
          </Typography>
        </Stack>

        <Stack direction="column" justifyContent="flex-start">
          <Typography variant="caption" color="text.secondary">
            현재 참여 인원: {party.currentUserCount}명 / {party.maxUserCount}명
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {party.currentUserCount < party.minUserCount ? (
              <>
                출발까지{" "}
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    color: "info.main",
                    fontWeight: 600,
                  }}
                >
                  {party.minUserCount - party.currentUserCount}명
                </Typography>
                남았어요!
              </>
            ) : (
              <>
                마감까지{" "}
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    color: "error.main",
                    fontWeight: 600,
                  }}
                >
                  {party.maxUserCount - party.currentUserCount}명
                </Typography>
                남았어요!
              </>
            )}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SimplePartyCard;
