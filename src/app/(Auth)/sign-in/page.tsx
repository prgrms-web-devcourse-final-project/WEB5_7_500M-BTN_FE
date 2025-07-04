"use client";

import * as React from "react";
import { Box, Button, TextField, Paper, Typography } from "@mui/material";
import OAuthBox from "./OAuthBox";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 처리 로직 (예시)
    alert(`로그인 시도: ${email}`);
    router.push("/");
  };
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, minWidth: 400 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            로그인
          </Typography>
          {/* <Image src="/logo.png" alt="logo" width={120} height={40} /> */}
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            로그인
          </Button>
          <OAuthBox />
        </Box>
      </Paper>
    </Box>
  );
}
