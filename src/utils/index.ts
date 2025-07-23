import { logger } from "./logger";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants";

// 날짜/시간 관련 유틸리티
export const formatDate = (
  date: string | Date,
  format: "short" | "long" | "time" = "short"
): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    switch (format) {
      case "short":
        return dateObj.toLocaleDateString("ko-KR");
      case "long":
        return dateObj.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        });
      case "time":
        return dateObj.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      default:
        return dateObj.toLocaleDateString("ko-KR");
    }
  } catch (error) {
    logger.error("날짜 포맷팅 실패", error);
    return "날짜 오류";
  }
};

export const formatDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    logger.error("날짜시간 포맷팅 실패", error);
    return "날짜 오류";
  }
};

export const isToday = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const today = new Date();
    return dateObj.toDateString() === today.toDateString();
  } catch (error) {
    logger.error("오늘 날짜 확인 실패", error);
    return false;
  }
};

export const isPast = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj < new Date();
  } catch (error) {
    logger.error("과거 날짜 확인 실패", error);
    return false;
  }
};

// 문자열 관련 유틸리티
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const capitalizeFirst = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

// 검증 관련 유틸리티
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^01[0-9]-\d{4}-\d{4}$/;
  return phoneRegex.test(formatPhoneNumber(phone));
};

export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("비밀번호는 6자 이상이어야 합니다.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 파일 관련 유틸리티
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const isValidImageFile = (file: File): boolean => {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  return validTypes.includes(file.type);
};

export const isValidFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

// 배열 관련 유틸리티
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const uniqueArray = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

export const sortByProperty = <T>(
  array: T[],
  property: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] => {
  return [...array].sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

// 객체 관련 유틸리티
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array)
    return obj.map((item) => deepClone(item)) as unknown as T;
  if (typeof obj === "object") {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

export const removeEmptyValues = <T extends Record<string, unknown>>(
  obj: T
): Partial<T> => {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== "") {
      result[key as keyof T] = value as T[keyof T];
    }
  }
  return result;
};

// 디바운스/쓰로틀 유틸리티
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// 로컬 스토리지 유틸리티
export const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    logger.error("로컬 스토리지 저장 실패", error);
  }
};

export const getLocalStorage = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    logger.error("로컬 스토리지 읽기 실패", error);
    return defaultValue || null;
  }
};

export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    logger.error("로컬 스토리지 삭제 실패", error);
  }
};

// URL 관련 유틸리티
export const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

export const parseQueryString = (
  queryString: string
): Record<string, string> => {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(queryString);

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
};

// 에러 처리 유틸리티
export const handleApiError = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as {
      response?: { status?: number; data?: { message?: string } };
    };
    const status = apiError.response?.status;

    if (status === 401) {
      return ERROR_MESSAGES.UNAUTHORIZED;
    }
    if (status === 403) {
      return ERROR_MESSAGES.FORBIDDEN;
    }
    if (status === 404) {
      return ERROR_MESSAGES.NOT_FOUND;
    }
    if (status && status >= 500) {
      return ERROR_MESSAGES.SERVER_ERROR;
    }

    return apiError.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return ERROR_MESSAGES.NETWORK_ERROR;
};

// 성능 측정 유틸리티
export const measurePerformance = <T>(name: string, fn: () => T): T => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  logger.debug(`Performance [${name}]: ${(end - start).toFixed(2)}ms`);
  return result;
};

export const measureAsyncPerformance = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  logger.debug(`Async Performance [${name}]: ${(end - start).toFixed(2)}ms`);
  return result;
};
