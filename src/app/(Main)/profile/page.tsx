"use client";
import React, { useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileInfoTab from "./ProfileInfoTab";
import ProfileReservationsTab from "./ProfileReservationsTab";
import ProfilePartiesTab from "./ProfilePartiesTab";
import ProfilePaymentTab from "./ProfilePaymentTab";
import ProfileMyShopsTab from "./ProfileMyShopsTab";
import ProfileMyShopsReservationTab from "./ProfileMyShopsReservationTab";

dayjs.locale("ko");

const TAB_LABELS = [
  "내 정보",
  "내가 예약한 식당",
  "내가 참여한 맛집 탐험 파티",
  "결제내역",
  "나의 식당",
  "나의 식당 예약 현황",
];

const ProfilePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 쿼리스트링에서 tab 값 읽기 (없으면 0)
  const getTabFromQuery = () => {
    const tabParam = searchParams.get("tab");
    const tabIndex = tabParam ? parseInt(tabParam, 10) : 0;
    return isNaN(tabIndex) || tabIndex < 0 || tabIndex >= TAB_LABELS.length
      ? 0
      : tabIndex;
  };

  const [tab, setTab] = React.useState(getTabFromQuery());

  // 쿼리스트링이 바뀌면 탭도 바꿔줌
  useEffect(() => {
    setTab(getTabFromQuery());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 탭 변경 시 쿼리스트링 변경
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("tab", newValue.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
    setTab(newValue);
  };

  return (
    <Box mx="auto" px={3} py={6}>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        {TAB_LABELS.map((label, i) => (
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
      {/* 나의 식당 예약 현황 */}
      {tab === 5 && <ProfileMyShopsReservationTab />}
    </Box>
  );
};

export default ProfilePage;
