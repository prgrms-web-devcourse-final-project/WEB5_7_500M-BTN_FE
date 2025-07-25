"use client";

import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Link as MuiLink,
  Badge,
} from "@mui/material";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import NextLink from "next/link";
import ChatIcon from "@mui/icons-material/Chat";
import { useMyInfo, useLogout, useMyParties } from "@/api/hooks";
import { getAccessToken } from "@/api/client";
import { getTotalUnreadCount } from "@/data/mockChatData";

const menuItems = [
  { label: "식당 찾기", path: "/shop" },
  { label: "맛집 탐험 파티", path: "/party" },
  { label: "고객센터", path: "/customer-service" },
];

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: myInfo } = useMyInfo();
  const { data: myPartiesData } = useMyParties();
  const logoutMutation = useLogout();
  const isLoggedIn = !!getAccessToken();

  // 채팅 알림 개수 계산
  const unreadChatCount = getTotalUnreadCount();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "#fff",
        border: 0,
        borderBottom: "1px solid #eee",
        borderRadius: 0,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: 64,
          position: "relative",
        }}
      >
        {/* 좌측 로고 */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => router.push("/")}
            sx={{ p: 0, minWidth: 40 }}
            disableRipple
          >
            <Image src="/logo.png" alt="logo" width={120} height={40} />
          </Button>
        </Box>
        {/* 가운데 메뉴 */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {menuItems.map((item) => (
            <MuiLink
              key={item.path}
              component={NextLink}
              href={item.path}
              underline="none"
              sx={{
                fontWeight: pathname === item.path ? 700 : 500,
                color: pathname === item.path ? "primary.main" : "text.primary",
                borderColor:
                  pathname === item.path ? "primary.main" : "transparent",
                px: 2,
                fontSize: 16,
                transition: "color 0.2s",
                "&:hover": {
                  color: "primary.light",
                },
                cursor: "pointer",
              }}
            >
              {item.label}
            </MuiLink>
          ))}
        </Box>
        {/* 우측 예약 현황 + 로그인 버튼 */}
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          gap={2}
        >
          {isLoggedIn ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push("/reservation-status")}
              >
                예약 현황
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => router.push("/my-shop")}
                sx={{ ml: 1 }}
              >
                내 식당
              </Button>
              <Badge badgeContent={unreadChatCount} color="error" max={99}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => router.push("/chat")}
                  sx={{ ml: 1, minWidth: "auto" }}
                >
                  <ChatIcon />
                </Button>
              </Badge>
              <Button
                variant="text"
                color="primary"
                onClick={() => router.push("/profile")}
                sx={{ ml: 1 }}
              >
                {myInfo?.data?.nickname || "프로필"}
              </Button>
              <Button
                variant="text"
                color="primary"
                onClick={() => logoutMutation.mutate("")}
                disabled={logoutMutation.isPending}
                sx={{ ml: 1 }}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <MuiLink
              component={NextLink}
              href="/sign-in"
              underline="none"
              sx={{
                fontWeight: 500,
                fontSize: 16,
                color: "primary.main",
                transition: "color 0.2s",
                "&:hover": {
                  color: "primary.dark",
                },
                cursor: "pointer",
              }}
            >
              로그인
            </MuiLink>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
