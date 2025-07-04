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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography variant="h6" fontWeight={600} noWrap>
            {party.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" ml={2}>
            {dayjs(party.dateTime).format("YYYY년 MM월 DD일 dddd A h:mm")}
          </Typography>
        </Stack>
        <Stack spacing={0.5} mb={2}>
          <Typography variant="subtitle1" fontWeight={500}>
            {party.restaurant.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {party.restaurant.address}
          </Typography>
        </Stack>
        <Box flexGrow={1} />
        <Stack direction="row" justifyContent="flex-start">
          <AvatarGroup max={5}>
            {party.users.map((user) => (
              <Avatar
                key={user.id}
                alt={user.nickname}
                src={user.profileImage}
              />
            ))}
          </AvatarGroup>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SimplePartyCard;
