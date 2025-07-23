import axios from "axios";
import { Configuration, APIApi } from "./generated";
import { logger, logAuth } from "@/utils/logger";

// API 기본 URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://matjalalzz.shop";

// Axios 인스턴스 생성
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 쿠키 자동 전송을 위한 설정
  headers: {
    "Content-Type": "application/json",
  },
});

// 액세스 토큰 관리
export const setAccessToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
    logAuth("액세스 토큰 저장", { token: token.substring(0, 20) + "..." });
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export const removeAccessToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    logAuth("액세스 토큰 제거");
  }
};

// 쿠키 관리 함수들
export const setCookie = (
  name: string,
  value: string,
  days: number = 7
): void => {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // HTTP 환경을 고려한 쿠키 설정
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  const isHttps = window.location.protocol === "https:";

  // HTTP 환경에서는 Secure 플래그를 제거하고, SameSite를 None으로 설정
  const secure = isHttps && !isLocalhost ? "; Secure" : "";
  const sameSite = isHttps ? "None" : "Lax";

  // HTTP 환경에서는 더 간단한 쿠키 설정 시도
  let cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/`;

  // HTTPS가 아닌 경우 SameSite 설정을 조정
  if (!isHttps) {
    cookieString += ";SameSite=Lax";
  } else {
    cookieString += `;SameSite=${sameSite}${secure}`;
  }

  logAuth("쿠키 설정 시도", {
    name,
    value: value.substring(0, 20) + "...",
    protocol: window.location.protocol,
    sameSite: isHttps ? sameSite : "Lax",
    secure: !!secure,
    cookieString: cookieString.substring(0, 100) + "...",
  });

  document.cookie = cookieString;

  // 설정 후 즉시 확인
  const savedCookie = getCookie(name);
  if (savedCookie) {
    logAuth("쿠키 저장 성공", {
      name,
      value: savedCookie.substring(0, 20) + "...",
    });
  } else {
    logger.warn(`쿠키 ${name} 저장 실패`);
    logger.debug("현재 모든 쿠키:", document.cookie);

    // 실패 시 더 간단한 방식으로 재시도
    const simpleCookieString = `${name}=${value};path=/`;
    logAuth("간단한 쿠키 설정 재시도", { simpleCookieString });
    document.cookie = simpleCookieString;

    const retryCookie = getCookie(name);
    if (retryCookie) {
      logAuth("간단한 방식으로 쿠키 저장 성공", {
        name,
        value: retryCookie.substring(0, 20) + "...",
      });
    } else {
      logAuth("쿠키 설정 완전 실패");
    }
  }
};

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

export const removeCookie = (name: string): void => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  logAuth("쿠키 제거", { name });
};

// 쿠키에서 토큰 가져오기
export const getToken = (name: string): string | null => {
  return getCookie(name);
};

// 쿠키 디버깅 함수 (개발 환경에서만)
export const debugCookies = (): void => {
  if (typeof document === "undefined" || process.env.NODE_ENV !== "development")
    return;

  logger.debug("=== 쿠키 디버깅 정보 ===");
  logger.debug("현재 URL:", window.location.href);
  logger.debug("현재 도메인:", window.location.hostname);
  logger.debug("현재 프로토콜:", window.location.protocol);
  logger.debug("현재 포트:", window.location.port);
  logger.debug("API 서버 URL:", API_BASE_URL);
  logger.debug("모든 쿠키:", document.cookie);
  logger.debug("쿠키 개수:", document.cookie.split(";").length);

  // 쿠키 상세 분석
  if (document.cookie) {
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie, index) => {
      const trimmed = cookie.trim();
      if (trimmed) {
        const [name, value] = trimmed.split("=");
        logger.debug(`쿠키 ${index + 1}:`, {
          name: name?.trim(),
          value: value ? value.substring(0, 20) + "..." : "undefined",
          fullValue: value?.trim(),
        });
      }
    });
  }

  // 브라우저 쿠키 정책 확인
  logger.debug("브라우저 쿠키 정책:", {
    cookieEnabled: navigator.cookieEnabled,
    userAgent: navigator.userAgent.substring(0, 100) + "...",
    platform: navigator.platform,
  });

  logger.debug("=======================");
};

// API 클라이언트 생성 함수
const createApiClient = () => {
  const configuration = new Configuration({
    basePath: API_BASE_URL,
  });
  return new APIApi(configuration, API_BASE_URL, axiosInstance);
};

// 싱글톤 인스턴스
export const apiClient = createApiClient();

// API 클라이언트 재생성 함수
export const refreshApiClient = (): void => {
  // 토큰이 변경되었을 때 클라이언트를 재생성하는 로직
  logAuth("API 클라이언트 재생성");
};

// 요청 인터셉터 - 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 401 에러 처리 및 쿠키에서 리프레시 토큰 확인
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답에서 Set-Cookie 헤더 확인
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      logAuth("Set-Cookie 헤더 감지", { setCookieHeader });
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      removeAccessToken();
      // 리프레시 토큰도 제거
      removeCookie("refreshToken");
    }
    return Promise.reject(error);
  }
);
