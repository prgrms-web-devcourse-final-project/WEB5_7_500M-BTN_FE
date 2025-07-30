"use client";

import * as React from "react";
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useOAuthSignup } from "@/api/hooks";
import { useToast } from "@/features/common/Toast";

import type { OAuthSignUpRequest } from "@/api/generated";
import { getAccessToken, getToken } from "@/api/client";

function OAuthSignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthSignupMutation = useOAuthSignup();
  const { showToast, hideToast } = useToast();
  const [formData, setFormData] = React.useState<OAuthSignUpRequest>({
    nickname: "",
    phoneNumber: "",
    name: "",
    age: undefined,
    gender: "M",
  });

  const handleInputChange =
    (field: keyof OAuthSignUpRequest) =>
    (
      e: React.ChangeEvent<HTMLInputElement> | { target: { value: unknown } }
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await oauthSignupMutation.mutateAsync(formData);
      showToast("OAuth 회원가입이 완료되었습니다!", "success");

      // 회원가입 완료 후 토큰 확인
      setTimeout(() => {
        const accessToken = getAccessToken();
        const refreshToken = getToken("refreshToken");

        if (accessToken || refreshToken) {
          console.log("OAuth 회원가입 후 토큰 확인됨");
          router.push("/");
        } else {
          console.log("OAuth 회원가입 후 토큰 없음, 로그인 페이지로 이동");
          router.push("/sign-in");
        }
      }, 1000);
    } catch (error) {
      console.error("OAuth 회원가입 실패:", error);
      showToast("OAuth 회원가입에 실패했습니다. 다시 시도해주세요.", "error");
    }
  };

  return (
    <>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          minHeight: "100vh",
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
              추가 정보 입력
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              OAuth 인증이 완료되었습니다. 추가 정보를 입력해주세요.
            </Typography>
          </Alert>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="닉네임"
              value={formData.nickname}
              onChange={handleInputChange("nickname")}
              required
              fullWidth
            />
            <TextField
              label="전화번호"
              value={formData.phoneNumber}
              onChange={handleInputChange("phoneNumber")}
              required
              fullWidth
              placeholder="010-1234-5678"
            />
            <TextField
              label="이름"
              value={formData.name}
              onChange={handleInputChange("name")}
              required
              fullWidth
            />
            <TextField
              label="나이"
              type="number"
              value={formData.age || ""}
              onChange={handleInputChange("age")}
              fullWidth
              inputProps={{ min: 1, max: 120 }}
            />
            <FormControl fullWidth>
              <InputLabel>성별</InputLabel>
              <Select
                value={formData.gender}
                label="성별"
                onChange={handleInputChange("gender")}
              >
                <MenuItem value="M">남성</MenuItem>
                <MenuItem value="W">여성</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={oauthSignupMutation.isPending}
            >
              {oauthSignupMutation.isPending ? "처리 중..." : "가입 완료"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export default function OAuthSignupPage() {
  return (
    <React.Suspense
      fallback={
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
            minHeight: "100vh",
          }}
        >
          <Paper elevation={3} sx={{ p: 4, minWidth: 400 }}>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              로딩 중...
            </Typography>
          </Paper>
        </Box>
      }
    >
      <OAuthSignupContent />
    </React.Suspense>
  );
}
