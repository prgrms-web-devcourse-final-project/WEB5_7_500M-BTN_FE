"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

export default function CustomerServicePage() {
  const router = useRouter();

  useEffect(() => {
    // 기본적으로 문의글 목록으로 리다이렉트
    router.replace("/customer-service/inquiries");
  }, [router]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="400px"
    >
      <CircularProgress />
    </Box>
  );
}
