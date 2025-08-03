"use client";

import { Box, Tabs, Tab } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function CustomerServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Box sx={{ py: 4 }}>{children}</Box>;
}
