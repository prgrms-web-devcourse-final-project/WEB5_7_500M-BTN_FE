"use client";

import { Box, Tabs, Tab } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function CustomerServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // 현재 탭 인덱스 결정
  const getTabIndex = (path: string) => {
    if (path.includes("/my-shops")) return 0;
    if (path.includes("/reservations")) return 1;
    if (path.includes("/inquiries") || path === "/customer-service") return 2;
    return 2; // 기본값은 문의글
  };

  const [tabIndex, setTabIndex] = useState(getTabIndex(pathname));

  // pathname 변경 시 탭 인덱스 업데이트
  useEffect(() => {
    setTabIndex(getTabIndex(pathname));
  }, [pathname]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    switch (newValue) {
      case 0:
        router.push("/customer-service/my-shops");
        break;
      case 1:
        router.push("/customer-service/reservations");
        break;
      case 2:
        router.push("/customer-service/inquiries");
        break;
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              fontSize: 16,
              fontWeight: 500,
              minHeight: 48,
            },
          }}
        >
          <Tab label="내 식당 목록" />
          <Tab label="예약현황" />
          <Tab label="문의글 목록" />
        </Tabs>
      </Box>
      {children}
    </Box>
  );
}
