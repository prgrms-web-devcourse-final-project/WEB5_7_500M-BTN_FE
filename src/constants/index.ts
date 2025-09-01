// API 관련 상수
export const API_CONSTANTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://matjalalzz.store",
  TIMEOUT: 10000,
  TOKEN_PREFIX: "Bearer ",
} as const;

// 카카오맵 관련 상수
export const KAKAO_MAP_CONSTANTS = {
  API_KEY:
    process.env.NEXT_PUBLIC_KAKAO_API_KEY || "c1ae6914a310b40050898f16a0aebb5f",
  DEFAULT_CENTER: { lat: 37.566826, lng: 126.9786567 },
  DEFAULT_ZOOM: 3,
} as const;

// 토스페이먼츠 관련 상수
export const TOSS_PAYMENTS_CONSTANTS = {
  CLIENT_KEY:
    process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ||
    "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq",
} as const;

// 쿠키 관련 상수
export const COOKIE_CONSTANTS = {
  DEFAULT_EXPIRES_DAYS: 7,
  TOKEN_NAMES: {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
    REFRESH_TOKEN_ALT: "refresh_token",
    AUTH_TOKEN: "auth_token",
    JWT_REFRESH: "jwt_refresh",
  },
} as const;

// 페이지네이션 관련 상수
export const PAGINATION_CONSTANTS = {
  DEFAULT_SIZE: 10,
  MAX_SIZE: 50,
} as const;

// 시간 관련 상수
export const TIME_CONSTANTS = {
  TOKEN_REFRESH_INTERVAL: 5 * 60 * 1000, // 5분
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30분
} as const;

// UI 관련 상수
export const UI_CONSTANTS = {
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
} as const;

// 파일 업로드 관련 상수
export const FILE_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  MAX_IMAGE_COUNT: 5,
} as const;

// 검색 관련 상수
export const SEARCH_CONSTANTS = {
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 50,
  SEARCH_DELAY: 500,
} as const;

// 파티 관련 상수
export const PARTY_CONSTANTS = {
  MIN_PARTICIPANTS: 2,
  MAX_PARTICIPANTS: 10,
  MIN_AGE: 18,
  MAX_AGE: 100,
} as const;

// 예약 관련 상수
export const RESERVATION_CONSTANTS = {
  MIN_HEAD_COUNT: 1,
  MAX_HEAD_COUNT: 20,
  ADVANCE_BOOKING_DAYS: 30,
} as const;

// 에러 메시지 상수
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
  UNAUTHORIZED: "로그인이 필요합니다.",
  FORBIDDEN: "접근 권한이 없습니다.",
  NOT_FOUND: "요청한 리소스를 찾을 수 없습니다.",
  SERVER_ERROR: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  VALIDATION_ERROR: "입력 정보를 확인해주세요.",
  TIMEOUT_ERROR: "요청 시간이 초과되었습니다.",
} as const;

// 성공 메시지 상수
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "로그인되었습니다.",
  SIGNUP_SUCCESS: "회원가입이 완료되었습니다.",
  LOGOUT_SUCCESS: "로그아웃되었습니다.",
  UPDATE_SUCCESS: "정보가 수정되었습니다.",
  CREATE_SUCCESS: "생성되었습니다.",
  DELETE_SUCCESS: "삭제되었습니다.",
  UPLOAD_SUCCESS: "업로드되었습니다.",
} as const;

// 카테고리 상수
export const CATEGORIES = {
  SHOP: {
    ALL: "ALL",
    KOREAN: "KOREAN",
    JAPANESE: "JAPANESE",
    CHINESE: "CHINESE",
    WESTERN: "WESTERN",
  },
  PARTY: {
    ALL: "ALL",
    KOREAN: "KOREAN",
    JAPANESE: "JAPANESE",
    CHINESE: "CHINESE",
    WESTERN: "WESTERN",
  },
} as const;

// 카테고리 한글 매핑
export const CATEGORY_LABELS: Record<string, string> = {
  ALL: "전체",
  KOREAN: "한식",
  JAPANESE: "일식",
  CHINESE: "중식",
  WESTERN: "양식",
} as const;

// 카테고리를 한글로 변환하는 함수
export const getCategoryLabel = (category: string): string => {
  return CATEGORY_LABELS[category] || category;
};

// 정렬 옵션 상수
export const SORT_OPTIONS = {
  NEAR: "NEAR",
  RESERVATION_COUNT: "RESERVATION_COUNT",
  RATING: "RATING",
  CREATED_AT: "CREATED_AT",
} as const;

// 상태 상수
export const STATUS_CONSTANTS = {
  PARTY: {
    RECRUITING: "RECRUITING",
    FULL: "FULL",
    CLOSED: "CLOSED",
    COMPLETED: "COMPLETED",
  },
  RESERVATION: {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    REFUSED: "REFUSED",
    COMPLETED: "COMPLETED",
  },
} as const;

// 성별 상수
export const GENDER_CONSTANTS = {
  MALE: "M",
  FEMALE: "W",
  ALL: "A",
} as const;
