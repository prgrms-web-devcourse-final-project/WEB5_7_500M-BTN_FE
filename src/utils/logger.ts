// 로깅 시스템
const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  log: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.log(`[LOG] ${message}`, ...args);
    }
  },

  error: (message: string, error?: unknown) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error);
    }
    // 프로덕션에서는 에러 추적 서비스로 전송
    if (!isDevelopment && error) {
      // TODO: Sentry나 다른 에러 추적 서비스 연동
    }
  },

  warn: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },

  info: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },

  debug: (message: string, ...args: unknown[]) => {
    if (isDevelopment && process.env.NEXT_PUBLIC_DEBUG === "true") {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
};

// API 에러 로깅 전용 함수
export const logApiError = (operation: string, error: unknown) => {
  logger.error(`API ${operation} 실패`, error);
};

// 인증 관련 로깅 전용 함수
export const logAuth = (operation: string, data?: unknown) => {
  logger.debug(`Auth ${operation}`, data);
};
