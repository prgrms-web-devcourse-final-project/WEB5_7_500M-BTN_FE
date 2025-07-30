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
import { MyInfoResponseRoleEnum } from "@/api/generated";
import { useState, useEffect } from "react";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드에서만 로그인 상태 확인
  useEffect(() => {
    setIsClient(true);
    setIsLoggedIn(!!getAccessToken());
  }, []);

  // 관리자 권한 확인
  const isAdmin = myInfo?.data?.role === MyInfoResponseRoleEnum.Admin;

  // 채팅 알림 개수 계산 (임시로 0으로 설정)
  const unreadChatCount = 0;

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
          {/* 관리자 버튼 - 관리자 권한이 있는 경우에만 표시 */}
          {isAdmin && (
            <MuiLink
              component={NextLink}
              href="/admin"
              underline="none"
              sx={{
                fontWeight: pathname === "/admin" ? 700 : 500,
                color: pathname === "/admin" ? "primary.main" : "text.primary",
                borderColor:
                  pathname === "/admin" ? "primary.main" : "transparent",
                px: 2,
                fontSize: 16,
                transition: "color 0.2s",
                "&:hover": {
                  color: "primary.light",
                },
                cursor: "pointer",
              }}
            >
              관리자
            </MuiLink>
          )}
        </Box>
        {/* 우측 로그인/프로필 영역 */}
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          gap={2}
        >
          {isClient && isLoggedIn ? (
            <>
              <Badge badgeContent={unreadChatCount} color="error" max={99}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => router.push("/chat")}
                  sx={{ minWidth: "auto" }}
                >
                  <ChatIcon />
                </Button>
              </Badge>
              <Button
                variant="text"
                color="primary"
                onClick={() => router.push("/profile")}
              >
                {myInfo?.data?.nickname || "프로필"}
              </Button>
              <Button
                variant="text"
                color="primary"
                onClick={async () => {
                  try {
                    await logoutMutation.mutateAsync();
                    router.push("/sign-in");
                  } catch (error) {
                    // 로그아웃 실패해도 로그인 페이지로 이동
                    router.push("/sign-in");
                  }
                }}
                disabled={logoutMutation.isPending}
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
