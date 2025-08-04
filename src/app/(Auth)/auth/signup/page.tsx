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
  Stepper,
  Step,
  StepLabel,
  Avatar,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Person,
  Phone,
  Cake,
  Wc,
  Visibility,
  VisibilityOff,
  ArrowBack,
} from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { useOAuthSignup } from "@/api/hooks";
import { useToast } from "@/features/common/Toast";
import Image from "next/image";

import type { OAuthSignUpRequest } from "@/api/generated";
import { getAccessToken, getToken } from "@/api/client";

const steps = ["기본 정보", "추가 정보", "가입 완료"];

function OAuthSignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthSignupMutation = useOAuthSignup();
  const { showToast, hideToast } = useToast();
  const [activeStep, setActiveStep] = React.useState(0);
  const [showPassword, setShowPassword] = React.useState(false);
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
      let value = String(e.target.value);

      // 전화번호 자동 포맷팅
      if (field === "phoneNumber") {
        // 숫자와 하이픈만 허용
        value = value.replace(/[^0-9-]/g, "");

        // 하이픈 자동 추가
        if (value.length >= 3 && !value.includes("-")) {
          value = value.slice(0, 3) + "-" + value.slice(3);
        }
        if (value.length >= 8 && value.split("-").length === 2) {
          value = value.slice(0, 8) + "-" + value.slice(8);
        }
      }

      // 나이 필드 처리
      if (field === "age") {
        const numValue = parseInt(value);
        if (isNaN(numValue)) {
          value = "";
        } else {
          value = numValue.toString();
        }
      }

      setFormData((prev) => ({
        ...prev,
        [field]:
          field === "age" ? (value ? parseInt(value) : undefined) : value,
      }));
    };

  const handleNext = () => {
    if (activeStep === 0) {
      // 기본 정보 검증
      if (!formData.nickname || !formData.name) {
        showToast("닉네임과 이름을 입력해주세요.", "error");
        return;
      }
      if (formData.nickname.length < 2) {
        showToast("닉네임은 2자 이상 입력해주세요.", "error");
        return;
      }
      if (formData.name.length < 2) {
        showToast("이름은 2자 이상 입력해주세요.", "error");
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 추가 정보 검증
    if (!formData.phoneNumber) {
      showToast("전화번호를 입력해주세요.", "error");
      return;
    }

    // 전화번호 형식 검증 (간단한 검증)
    const phoneRegex = /^[0-9-]+$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      showToast("올바른 전화번호 형식을 입력해주세요.", "error");
      return;
    }

    // 전화번호 길이 검증
    const phoneNumberOnly = formData.phoneNumber.replace(/-/g, "");
    if (phoneNumberOnly.length < 10 || phoneNumberOnly.length > 11) {
      showToast("올바른 전화번호를 입력해주세요.", "error");
      return;
    }

    // 나이 검증 (입력된 경우에만)
    if (
      formData.age !== undefined &&
      (formData.age < 1 || formData.age > 120)
    ) {
      showToast("올바른 나이를 입력해주세요.", "error");
      return;
    }

    try {
      await oauthSignupMutation.mutateAsync(formData);
      showToast("OAuth 회원가입이 완료되었습니다!", "success");
      setActiveStep(2);

      // 회원가입 완료 후 토큰 확인
      setTimeout(() => {
        const accessToken = getAccessToken();
        const refreshToken = getToken("refreshToken");

        if (accessToken || refreshToken) {
          router.push("/");
        } else {
          router.push("/sign-in");
        }
      }, 2000);
    } catch (error) {
      showToast("OAuth 회원가입에 실패했습니다. 다시 시도해주세요.", "error");
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "primary.main",
                }}
              >
                <Person sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                기본 정보 입력
              </Typography>
              <Typography variant="body2" color="text.secondary">
                서비스 이용을 위한 기본 정보를 입력해주세요
              </Typography>
            </Box>

            <TextField
              label="닉네임 (필수)"
              value={formData.nickname}
              onChange={handleInputChange("nickname")}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              placeholder="사용할 닉네임을 입력하세요"
            />
            <TextField
              label="이름 (필수)"
              value={formData.name}
              onChange={handleInputChange("name")}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              placeholder="실명을 입력하세요"
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                추가 정보 입력
              </Typography>
              <Typography variant="body2" color="text.secondary">
                더 나은 서비스 이용을 위한 추가 정보를 입력해주세요
              </Typography>
            </Box>

            <TextField
              label="전화번호 (필수)"
              value={formData.phoneNumber}
              onChange={handleInputChange("phoneNumber")}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
              placeholder="010-1234-5678 (자동 포맷팅)"
            />
            <TextField
              label="나이 (선택사항)"
              type="number"
              value={formData.age || ""}
              onChange={handleInputChange("age")}
              fullWidth
              inputProps={{ min: 1, max: 120 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Cake color="action" />
                  </InputAdornment>
                ),
              }}
              placeholder="나이를 입력하세요 (선택사항)"
            />
            <FormControl fullWidth>
              <InputLabel>성별 (선택사항)</InputLabel>
              <Select
                value={formData.gender}
                label="성별 (선택사항)"
                onChange={handleInputChange("gender")}
                startAdornment={
                  <InputAdornment position="start">
                    <Wc color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="M">남성</MenuItem>
                <MenuItem value="W">여성</MenuItem>
                <MenuItem value="">선택안함</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                bgcolor: "success.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <Typography variant="h3" color="white">
                ✓
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom>
              회원가입 완료!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              환영합니다! 곧 메인 페이지로 이동합니다.
            </Typography>
          </Box>
        );

      default:
        return null;
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
          p: 2,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, minWidth: 400, maxWidth: 500 }}>
          {/* 헤더 */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton onClick={() => router.push("/sign-in")} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                style={{ marginRight: 8 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                추가 정보 입력
              </Typography>
            </Box>
          </Box>

          {/* 스테퍼 */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              OAuth 인증이 완료되었습니다. 추가 정보를 입력해주세요.
            </Typography>
          </Alert>

          {/* 스텝 컨텐츠 */}
          <Box sx={{ mb: 3 }}>{renderStepContent()}</Box>

          {/* 버튼 */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBack />}
            >
              이전
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    const accessToken = getAccessToken();
                    const refreshToken = getToken("refreshToken");

                    if (accessToken || refreshToken) {
                      router.push("/");
                    } else {
                      router.push("/sign-in");
                    }
                  }}
                  disabled={oauthSignupMutation.isPending}
                >
                  메인으로 이동
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={activeStep === 1 ? handleSubmit : handleNext}
                  disabled={oauthSignupMutation.isPending}
                >
                  {activeStep === 1
                    ? oauthSignupMutation.isPending
                      ? "처리 중..."
                      : "가입 완료"
                    : "다음"}
                </Button>
              )}
            </Box>
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
