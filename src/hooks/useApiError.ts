import { useEffect } from "react";
import { useToast } from "@/features/common/Toast";
import {
  getErrorMessage,
  getErrorSeverity,
  logError,
} from "@/utils/errorHandler";

/**
 * API 에러를 자동으로 토스트로 표시하는 훅
 */
export const useApiError = (error: any, context?: string) => {
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      // 에러 로깅
      logError(error, context);

      // 에러 메시지 추출
      const message = getErrorMessage(error);
      const severity = getErrorSeverity(error);

      // 토스트 표시
      showToast(message, severity);
    }
  }, [error, context, showToast]);
};

/**
 * API 에러를 수동으로 처리하는 훅
 */
export const useApiErrorHandler = () => {
  const { showToast } = useToast();

  const handleError = (error: any, context?: string) => {
    // 에러 로깅
    logError(error, context);

    // 에러 메시지 추출
    const message = getErrorMessage(error);
    const severity = getErrorSeverity(error);

    // 토스트 표시
    showToast(message, severity);
  };

  return { handleError };
};
