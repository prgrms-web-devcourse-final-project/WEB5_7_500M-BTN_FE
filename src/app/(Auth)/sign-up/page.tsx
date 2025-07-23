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
  Link,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSignUp } from "@/api/hooks";
import { useToast } from "@/features/common/Toast";
import Toast from "@/features/common/Toast";
import type { SignUpRequest } from "@/api/generated";

export default function SignUpPage() {
  const router = useRouter();
  const signUpMutation = useSignUp();
  const { toast, showToast, hideToast } = useToast();

  const [formData, setFormData] = React.useState<SignUpRequest>({
    email: "",
    password: "",
    nickname: "",
    phoneNumber: "",
    name: "",
    age: undefined,
    gender: "M",
  });

  const handleInputChange =
    (field: keyof SignUpRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: field === "age" ? (value ? Number(value) : undefined) : value,
      }));
    };

  const handleSelectChange =
    (field: keyof SignUpRequest) => (value: unknown) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signUpMutation.mutateAsync(formData);
      showToast("회원가입이 완료되었습니다!", "success");
      router.push("/sign-in");
    } catch (error) {
      console.error("회원가입 실패:", error);
      showToast("회원가입에 실패했습니다. 다시 시도해주세요.", "error");
    }
  };

  return (
    <>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={hideToast}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, minWidth: 400, maxWidth: 500 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              회원가입
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="이메일"
              type="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              required
              fullWidth
            />
            <TextField
              label="비밀번호"
              type="password"
              value={formData.password}
              onChange={handleInputChange("password")}
              required
              fullWidth
            />
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
            <FormControl fullWidth required>
              <InputLabel>성별</InputLabel>
              <Select
                value={formData.gender}
                label="성별"
                onChange={(e) => handleSelectChange("gender")(e.target.value)}
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
              disabled={signUpMutation.isPending}
              sx={{ mt: 2 }}
            >
              {signUpMutation.isPending ? "가입 중..." : "회원가입"}
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                이미 계정이 있으신가요?{" "}
                <Link
                  href="/sign-in"
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  로그인
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
