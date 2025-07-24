// 기본 API 응답 타입
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// 페이지네이션 타입
export interface PaginationParams {
  page?: number;
  size?: number;
  cursor?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// 검색 파라미터 타입
export interface SearchParams {
  query?: string;
  category?: string;
  sort?: string;
  filter?: string;
}

// 위치 정보 타입
export interface Location {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  x: string; // 경도
  y: string; // 위도
  category?: string;
}

// 파일 업로드 타입
export interface FileUpload {
  file: File;
  presignedUrl: string;
  key: string;
}

// 폼 데이터 타입
export interface FormData {
  [key: string]: string | number | boolean | File | undefined;
}

// 에러 타입
export interface ApiError {
  status: number;
  code: string;
  message: string;
  path: string;
}

// API 응답 에러 타입
export interface ApiErrorResponse {
  status: number;
  code: string;
  message: string;
  path: string;
}

// 로딩 상태 타입
export interface LoadingState {
  isLoading: boolean;
  error: ApiError | null;
}

// 토스트 메시지 타입
export interface ToastMessage {
  message: string;
  severity: "success" | "error" | "warning" | "info";
  duration?: number;
}

// 사용자 정보 타입
export interface UserInfo {
  userId: number;
  email: string;
  nickname: string;
  name?: string;
  phoneNumber?: string;
  age?: number;
  gender?: "M" | "W";
  profileImageUrl?: string;
}

// 식당 정보 타입
export interface ShopInfo {
  shopId: number;
  shopName: string;
  description?: string;
  address: string;
  phoneNumber?: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  reservationFee?: number;
  images?: string[];
  businessHours?: BusinessHours;
  location: Location;
}

// 영업시간 타입
export interface BusinessHours {
  openTime: string;
  closeTime: string;
  breakTime?: string;
  closedDays?: string[];
}

// 파티 정보 타입
export interface PartyInfo {
  partyId: number;
  title: string;
  description?: string;
  shopId: number;
  shopName: string;
  hostId: number;
  hostName: string;
  metAt: string;
  deadline: string;
  currentCount: number;
  maxCount: number;
  genderCondition: "M" | "W" | "A";
  minAge?: number;
  maxAge?: number;
  status: "RECRUITING" | "FULL" | "CLOSED" | "COMPLETED";
  createdAt: string;
  participants?: PartyParticipant[];
}

// 파티 참여자 타입
export interface PartyParticipant {
  userId: number;
  nickname: string;
  profileImageUrl?: string;
  joinedAt: string;
}

// 예약 정보 타입
export interface ReservationInfo {
  reservationId: number;
  shopId: number;
  shopName: string;
  userId: number;
  userName: string;
  date: string;
  time: string;
  headCount: number;
  reservationFee: number;
  status: "PENDING" | "CONFIRMED" | "REFUSED" | "COMPLETED";
  createdAt: string;
}

// 리뷰 정보 타입
export interface ReviewInfo {
  reviewId: number;
  shopId: number;
  shopName: string;
  userId: number;
  userName: string;
  rating: number;
  content: string;
  images?: string[];
  createdAt: string;
}

// 결제 정보 타입
export interface PaymentInfo {
  orderId: string;
  amount: number;
  orderName: string;
  customerName: string;
  customerEmail: string;
  successUrl: string;
  failUrl: string;
}

// 결제 결과 타입
export interface PaymentResult {
  success: boolean;
  orderId: string;
  paymentKey?: string;
  amount?: number;
  errorCode?: string;
  errorMessage?: string;
}

// 필터 옵션 타입
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

// 정렬 옵션 타입
export interface SortOption {
  value: string;
  label: string;
  direction?: "asc" | "desc";
}

// 모달/다이얼로그 타입
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
}

// 카드 컴포넌트 공통 타입
export interface CardProps {
  id: number | string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  price?: number;
  status?: string;
  onClick?: () => void;
  actions?: React.ReactNode;
}

// 테이블 컬럼 타입
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  width?: number | string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

// 차트 데이터 타입
export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

// 통계 정보 타입
export interface Statistics {
  totalCount: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  growthRate?: number;
}

// 알림 타입
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// 설정 타입
export interface UserSettings {
  theme: "light" | "dark" | "system";
  language: "ko" | "en";
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    locationVisible: boolean;
  };
}
