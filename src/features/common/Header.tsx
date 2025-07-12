"use client";

import { AppBar, Box, Button, Toolbar, Link as MuiLink } from "@mui/material";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import NextLink from "next/link";

const menuItems = [
  { label: "식당 찾기", path: "/shop" },
  { label: "맛집 탐험 파티", path: "/party" },
];

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

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
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
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
        <Box sx={{ display: "flex", gap: 2 }}>
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
        {/* 우측 로그인 버튼 */}
        <Box width={120} display="flex" justifyContent="flex-end">
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
