"use client";
import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Stack,
  Divider,
  Chip,
  Tabs,
  Tab,
  Rating,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import ProfileInfoTab from "./ProfileInfoTab";
import ProfileReservationsTab from "./ProfileReservationsTab";
import ProfilePartiesTab from "./ProfilePartiesTab";
import ProfilePaymentTab from "./ProfilePaymentTab";
import ProfileMyShopsTab from "./ProfileMyShopsTab";

dayjs.locale("ko");

const ProfilePage = () => {
  const [tab, setTab] = React.useState(0);

  return (
    <Box mx="auto" px={3} py={6}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        {[
          "내 정보",
          "나의 식당 예약 정보",
          "나의 맛집 탐험 파티 정보",
          "결제내역",
          "내가 등록한 식당",
        ].map((label, i) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
      {/* 내 정보 */}
      {tab === 0 && <ProfileInfoTab />}
      {/* 나의 식당 예약 정보 */}
      {tab === 1 && <ProfileReservationsTab />}
      {/* 나의 맛집 탐험 파티 정보 */}
      {tab === 2 && <ProfilePartiesTab />}
      {/* 결제내역 */}
      {tab === 3 && <ProfilePaymentTab />}
      {/* 내가 등록한 식당 */}
      {tab === 4 && <ProfileMyShopsTab />}
    </Box>
  );
};

export default ProfilePage;
