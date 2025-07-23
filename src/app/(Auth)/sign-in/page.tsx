"use client";

import * as React from "react";
import { Box, Button, Paper, Typography, Stack, Divider } from "@mui/material";
import OAuthBox from "./OAuthBox";
import { useAuth } from "@/hooks/useAuth";
import { useForm, validationRules } from "@/hooks/useForm";
import {
  EmailFormField,
  PasswordFormField,
} from "@/components/common/FormField";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import type { LoginRequest } from "@/api/generated";

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();

  // 폼 상태 관리
  const form = useForm<LoginRequest>(
    {
      email: "",
      password: "",
    },
    {
      email: validationRules.email,
      password: validationRules.password,
    }
  );

  const handleSubmit = form.handleSubmit(async (values) => {
    console.log("로그인 시도:", values);
    try {
      await login(values);
      console.log("로그인 성공!");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  });

  if (isLoggingIn) {
    return <LoadingSpinner message="로그인 중..." />;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="grey.50"
      p={2}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" textAlign="center" fontWeight={700} mb={3}>
          로그인
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <EmailFormField
              name="email"
              label="이메일"
              value={form.values.email}
              onChange={(value) => form.setFieldValue("email", value)}
              error={form.errors.email}
              touched={form.touched.email}
              required
            />

            <PasswordFormField
              name="password"
              label="비밀번호"
              value={form.values.password}
              onChange={(value) => form.setFieldValue("password", value)}
              error={form.errors.password}
              touched={form.touched.password}
              required
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!form.isValid || isLoggingIn}
              sx={{ mt: 2 }}
            >
              로그인
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 3 }}>또는</Divider>

        <OAuthBox />
      </Paper>
    </Box>
  );
}
