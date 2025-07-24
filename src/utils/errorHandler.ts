import { ApiError } from "@/types";

// API 에러 메시지 매핑
const ERROR_MESSAGES: Record<string, string> = {
  AUTHENTICATION_REQUIRED: "로그인이 필요합니다.",
  UNAUTHORIZED: "인증에 실패했습니다.",
  FORBIDDEN: "접근 권한이 없습니다.",
  NOT_FOUND: "요청한 리소스를 찾을 수 없습니다.",
  VALIDATION_ERROR: "입력값을 확인해주세요.",
  INTERNAL_SERVER_ERROR: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  NETWORK_ERROR: "네트워크 연결을 확인해주세요.",
  TIMEOUT_ERROR: "요청 시간이 초과되었습니다.",
};

// HTTP 상태 코드별 기본 메시지
const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: "잘못된 요청입니다.",
  401: "로그인이 필요합니다.",
  403: "접근 권한이 없습니다.",
  404: "요청한 리소스를 찾을 수 없습니다.",
  409: "이미 존재하는 데이터입니다.",
  422: "입력값을 확인해주세요.",
  500: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  502: "서버를 일시적으로 사용할 수 없습니다.",
  503: "서비스가 일시적으로 중단되었습니다.",
  504: "요청 시간이 초과되었습니다.",
};

/**
 * API 에러에서 사용자 친화적인 메시지를 추출합니다.
 */
export const getErrorMessage = (error: any): string => {
  // Axios 에러 응답에서 API 에러 정보 추출
  if (error?.response?.data) {
    const apiError = error.response.data as ApiError;

    // API에서 제공한 메시지가 있으면 우선 사용
    if (apiError.message) {
      return apiError.message;
    }

    // 에러 코드에 따른 메시지 매핑
    if (apiError.code && ERROR_MESSAGES[apiError.code]) {
      return ERROR_MESSAGES[apiError.code];
    }
  }

  // HTTP 상태 코드에 따른 메시지
  const status = error?.response?.status;
  if (status && HTTP_STATUS_MESSAGES[status]) {
    return HTTP_STATUS_MESSAGES[status];
  }

  // 네트워크 에러
  if (
    error?.code === "NETWORK_ERROR" ||
    error?.message?.includes("Network Error")
  ) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // 타임아웃 에러
  if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
    return ERROR_MESSAGES.TIMEOUT_ERROR;
  }

  // 기본 에러 메시지
  return error?.message || "알 수 없는 오류가 발생했습니다.";
};

/**
 * 에러의 심각도를 판단합니다.
 */
export const getErrorSeverity = (error: any): "error" | "warning" | "info" => {
  const status = error?.response?.status;

  // 401, 403은 warning으로 처리 (사용자 액션 필요)
  if (status === 401 || status === 403) {
    return "warning";
  }

  // 4xx 에러는 info로 처리 (사용자 입력 문제)
  if (status >= 400 && status < 500) {
    return "info";
  }

  // 5xx 에러는 error로 처리 (서버 문제)
  return "error";
};

/**
 * 에러를 로깅합니다.
 */
export const logError = (error: any, context?: string): void => {
  const errorInfo = {
    message: error?.message,
    status: error?.response?.status,
    code: error?.response?.data?.code,
    path: error?.response?.data?.path,
    url: error?.config?.url,
    method: error?.config?.method,
    context,
  };

  console.error("API Error:", errorInfo);

  // 개발 환경에서만 상세 로깅
  if (process.env.NODE_ENV === "development") {
    console.error("Full error object:", error);
  }
};
