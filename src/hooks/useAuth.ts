import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/features/common/Toast";
import { useLogin, useSignUp, useLogout, useMyInfo } from "@/api/hooks";
import { setAccessToken, removeAccessToken, getToken } from "@/api/client";
import { logger } from "@/utils/logger";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants";
import type { LoginRequest, SignUpRequest } from "@/api/generated";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // 내 정보 조회
  const { data: myInfoData, isLoading: isLoadingUser } = useMyInfo();
  const user = myInfoData?.data;

  // 로그인
  const loginMutation = useLogin();
  const handleLogin = async (credentials: LoginRequest) => {
    try {
      await loginMutation.mutateAsync(credentials);

      // 로그인 성공 시 바로 메인 페이지로 이동
      showToast(SUCCESS_MESSAGES.LOGIN_SUCCESS, "success");
      router.push("/");
    } catch (error) {
      logger.error("로그인 실패", error);
      showToast(ERROR_MESSAGES.UNAUTHORIZED, "error");
      throw error;
    }
  };

  // 회원가입
  const signUpMutation = useSignUp();
  const handleSignUp = async (userData: SignUpRequest) => {
    try {
      await signUpMutation.mutateAsync(userData);
      showToast(SUCCESS_MESSAGES.SIGNUP_SUCCESS, "success");
      router.push("/sign-in");
    } catch (error) {
      logger.error("회원가입 실패", error);
      showToast("회원가입에 실패했습니다. 다시 시도해주세요.", "error");
      throw error;
    }
  };

  // 로그아웃
  const logoutMutation = useLogout();
  const handleLogout = async () => {
    try {
      const refreshToken = getToken("refreshToken");
      if (refreshToken) {
        await logoutMutation.mutateAsync(refreshToken);
      }

      removeAccessToken();
      showToast(SUCCESS_MESSAGES.LOGOUT_SUCCESS, "success");
      router.push("/sign-in");
    } catch (error) {
      logger.error("로그아웃 실패", error);
      // 로그아웃 실패해도 로컬 토큰은 제거
      removeAccessToken();
      showToast("로그아웃되었습니다.", "info");
      router.push("/sign-in");
    }
  };

  // 인증 상태 확인
  const isAuthenticated = !!user;
  const isGuest = !isAuthenticated;

  return {
    // 상태
    user,
    isAuthenticated,
    isGuest,
    isLoadingUser,

    // 액션
    login: handleLogin,
    signUp: handleSignUp,
    logout: handleLogout,

    // 뮤테이션 상태
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};
