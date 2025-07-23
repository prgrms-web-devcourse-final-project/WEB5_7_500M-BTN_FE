import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiClient,
  setAccessToken,
  removeAccessToken,
  refreshApiClient,
  getCookie,
  setCookie,
  removeCookie,
  debugCookies,
  getToken,
} from "./client";
import { logApiError, logAuth } from "@/utils/logger";
import type {
  BaseResponseShopsResponse,
  BaseResponsePartyScrollResponse,
  BaseResponseMyInfoResponse,
  CreateReservationRequest,
  CreateReservationResponse,
  LoginRequest,
  SignUpRequest,
  OAuthSignUpRequest,
  BaseResponseMyReservationPageResponse,
  BaseResponseMyPartyPageResponse,
  BaseResponseMyReviewPageResponse,
  GetShopsCategoryEnum,
  GetPartiesStatusEnum,
  GetPartiesGenderEnum,
  GetPartiesCategoriesEnum,
  GetReservationsFilterEnum,
  GetShopsBySearchSortEnum,
  BaseResponseShopDetailResponse,
  ReviewCreateRequest,
  BaseResponsePreSignedUrlListResponse,
  BaseResponsePreSignedUrlResponse,
  PartyCreateRequest,
  BaseResponsePartyDetailResponse,
  MyInfoUpdateRequest,
  ShopCreateRequest,
} from "./generated";

// 공통 에러 타입
export interface ApiError {
  message: string;
  status?: number;
}

// 식당 목록 조회 훅
export const useShops = (params?: {
  latitude?: number;
  longitude?: number;
  radius?: number;
  category?: Array<GetShopsCategoryEnum>;
  sort?: string;
  cursor?: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: ["shops", params],
    queryFn: async () => {
      const response = await apiClient.getShops(
        params?.latitude,
        params?.longitude,
        params?.radius,
        params?.category,
        params?.sort,
        params?.cursor,
        params?.size
      );
      return response.data;
    },
    enabled: true,
  });
};

// 파티 목록 조회 훅
export const useParties = (params?: {
  status?: GetPartiesStatusEnum;
  gender?: GetPartiesGenderEnum;
  minAge?: number;
  maxAge?: number;
  location?: string;
  categories?: Array<GetPartiesCategoriesEnum>;
  query?: string;
  cursor?: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: ["parties", params],
    queryFn: async () => {
      const response = await apiClient.getParties(
        params?.status,
        params?.gender,
        params?.minAge,
        params?.maxAge,
        params?.location,
        params?.categories,
        params?.query,
        params?.cursor,
        params?.size
      );
      return response.data;
    },
    enabled: true,
  });
};

// 내 정보 조회 훅
export const useMyInfo = () => {
  return useQuery<BaseResponseMyInfoResponse>({
    queryKey: ["myInfo"],
    queryFn: async () => {
      try {
        const response = await apiClient.getMyInfo();
        return response.data;
      } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
          const apiError = error as { response?: { status?: number } };
          if (apiError.response?.status === 401) {
            removeAccessToken();
          }
        }
        throw error;
      }
    },
    enabled: true,
  });
};

// 내 예약 목록 조회 훅
export const useMyReservations = (params?: {
  size?: number;
  cursor?: number;
}) => {
  return useQuery({
    queryKey: ["myReservations", params],
    queryFn: async () => {
      const response = await apiClient.getMyReservations(
        params?.size,
        params?.cursor
      );
      return response.data;
    },
    enabled: true,
  });
};

// 내 파티 목록 조회 훅
export const useMyParties = (params?: { size?: number; cursor?: number }) => {
  return useQuery({
    queryKey: ["myParties", params],
    queryFn: async () => {
      const response = await apiClient.getMyParties(
        params?.size,
        params?.cursor
      );
      return response.data;
    },
    enabled: true,
  });
};

// 내 리뷰 목록 조회 훅
export const useMyReviews = (params?: { size?: number; cursor?: number }) => {
  return useQuery({
    queryKey: ["myReviews", params],
    queryFn: async () => {
      const response = await apiClient.getMyReviews(
        params?.size,
        params?.cursor
      );
      return response.data;
    },
    enabled: true,
  });
};

// 내 식당 목록 조회 훅
export const useOwnerShops = () => {
  return useQuery({
    queryKey: ["ownerShops"],
    queryFn: async () => {
      const response = await apiClient.getOwnerShops();
      return response.data;
    },
    enabled: true,
  });
};

// 식당 상세 조회 훅
export const useShopDetail = (shopId: number) => {
  return useQuery({
    queryKey: ["shopDetail", shopId],
    queryFn: async () => {
      const response = await apiClient.getDetailShop(shopId);
      return response.data;
    },
    enabled: !!shopId,
  });
};

// 식당 리뷰 조회 훅
export const useShopReviews = (
  shopId: number,
  params?: { size?: number; cursor?: number }
) => {
  return useQuery({
    queryKey: ["shopReviews", shopId, params],
    queryFn: async () => {
      const response = await apiClient.getReviews(
        shopId,
        params?.cursor,
        params?.size
      );
      return response.data;
    },
    enabled: !!shopId,
  });
};

// 로그인 훅
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loginData: LoginRequest) => {
      // 초기 쿠키 상태 확인
      logAuth("로그인 시작");
      logAuth("브라우저 환경 정보", {
        protocol:
          typeof window !== "undefined" ? window.location.protocol : "SSR",
        hostname:
          typeof window !== "undefined" ? window.location.hostname : "SSR",
        origin: typeof window !== "undefined" ? window.location.origin : "SSR",
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "SSR",
      });
      debugCookies();

      localStorage.removeItem("accessToken");
      removeCookie("refreshToken"); // 기존 쿠키 제거

      logAuth("로그인 요청 시작");
      const response = await apiClient.login(loginData);
      logAuth("로그인 응답 받음");

      // axios 응답에서 헤더 추출
      const accessToken = response.headers?.["authorization"]?.replace(
        "Bearer ",
        ""
      );
      if (accessToken) {
        setAccessToken(accessToken);
        logAuth("액세스 토큰 저장됨", {
          token: accessToken.substring(0, 20) + "...",
        });
        // 토큰 갱신 후 클라이언트 재생성
        refreshApiClient();
      }

      // Set-Cookie 헤더 확인 (디버깅용)
      const setCookieHeader = response.headers["set-cookie"];
      if (setCookieHeader) {
        logAuth("Set-Cookie 헤더 감지", { setCookieHeader });

        // Set-Cookie 헤더 내용 분석
        if (Array.isArray(setCookieHeader)) {
          setCookieHeader.forEach((cookie, index) => {
            logAuth(`Set-Cookie ${index + 1} 상세 분석`, {
              fullCookie: cookie,
              hasHttpOnly: cookie.includes("HttpOnly"),
              hasSecure: cookie.includes("Secure"),
              hasSameSite: cookie.includes("SameSite"),
              hasPath: cookie.includes("Path="),
            });

            // HttpOnly가 아닌 경우 수동으로 쿠키 설정 시도
            if (!cookie.includes("HttpOnly")) {
              const cookieMatch = cookie.match(/^([^=]+)=([^;]+)/);
              if (cookieMatch) {
                const [, cookieName, cookieValue] = cookieMatch;
                if (cookieName.toLowerCase().includes("refresh")) {
                  logAuth("HttpOnly가 아닌 리프레시 토큰 발견, 수동 설정 시도");
                  setCookie(cookieName, cookieValue, 7);
                }
              }
            }
          });
        } else {
          const cookieString = String(setCookieHeader);
          logAuth("Set-Cookie 단일 헤더 상세 분석", {
            fullCookie: cookieString,
            hasHttpOnly: cookieString.includes("HttpOnly"),
            hasSecure: cookieString.includes("Secure"),
            hasSameSite: cookieString.includes("SameSite"),
            hasPath: cookieString.includes("Path="),
          });

          // HttpOnly가 아닌 경우 수동으로 쿠키 설정 시도
          if (!cookieString.includes("HttpOnly")) {
            const cookieMatch = cookieString.match(/^([^=]+)=([^;]+)/);
            if (cookieMatch) {
              const [, cookieName, cookieValue] = cookieMatch;
              if (cookieName.toLowerCase().includes("refresh")) {
                logAuth("HttpOnly가 아닌 리프레시 토큰 발견, 수동 설정 시도");
                setCookie(cookieName, cookieValue, 7);
              }
            }
          }
        }
      } else {
        logAuth("Set-Cookie 헤더가 없습니다");
      }

      // 쿠키에서 리프레시 토큰 확인
      const refreshToken = getToken("refreshToken");
      if (refreshToken) {
        logAuth("리프레시 토큰 발견", {
          token: refreshToken.substring(0, 20) + "...",
        });
      } else {
        logAuth("리프레시 토큰을 찾을 수 없음");
        // 현재 모든 쿠키 확인
        logAuth("현재 모든 쿠키", { cookies: document.cookie });

        // 다른 가능한 쿠키 이름들 확인
        const possibleNames = ["refreshToken", "refresh_token", "token"];
        possibleNames.forEach((name) => {
          const token = getToken(name);
          if (token) {
            logAuth(`토큰 ${name} 발견`, {
              token: token.substring(0, 20) + "...",
            });
          }
        });
      }

      // 최종 쿠키 상태 확인
      logAuth("로그인 완료 후 쿠키 상태");
      debugCookies();

      return response.data;
    },
    onSuccess: () => {
      // 로그인 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    },
  });
};

// 회원가입 훅
export const useSignUp = () => {
  return useMutation({
    mutationFn: (signUpData: SignUpRequest) => {
      localStorage.removeItem("accessToken");
      return apiClient.signup(signUpData);
    },
  });
};

// 예약 생성 훅
export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      shopId: number;
      reservationData: CreateReservationRequest;
      partyId?: number;
    }) =>
      apiClient.createReservation(
        params.shopId,
        params.reservationData,
        params.partyId
      ),
    onSuccess: () => {
      // 예약 생성 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["myReservations"] });
    },
  });
};

// 파티 상세 조회 훅
export const usePartyDetail = (partyId: number) => {
  return useQuery({
    queryKey: ["partyDetail", partyId],
    queryFn: async () => {
      const response = await apiClient.getPartyDetail(partyId);
      return response.data;
    },
    enabled: !!partyId,
  });
};

// 파티 생성 훅
export const useCreateParty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partyData: PartyCreateRequest) =>
      apiClient.createParty(partyData),
    onSuccess: () => {
      // 파티 생성 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      queryClient.invalidateQueries({ queryKey: ["myParties"] });
    },
  });
};

// 파티 참여 훅
export const useJoinParty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partyId: number) => apiClient.joinParty(partyId),
    onSuccess: () => {
      // 파티 참여 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      queryClient.invalidateQueries({ queryKey: ["myParties"] });
    },
  });
};

// 파티 나가기 훅
export const useQuitParty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partyId: number) => apiClient.quitParty(partyId),
    onSuccess: () => {
      // 파티 나가기 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      queryClient.invalidateQueries({ queryKey: ["myParties"] });
    },
  });
};

// 내 정보 수정 훅
export const useUpdateMyInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: MyInfoUpdateRequest) =>
      apiClient.updateMyInfo(updateData),
    onSuccess: () => {
      // 정보 수정 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    },
  });
};

// 로그아웃 훅
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (refreshToken: string) => {
      await apiClient.logout(refreshToken);
      // 로컬 스토리지에서 토큰 제거
      removeAccessToken();
      // 클라이언트 재생성
      refreshApiClient();
    },
    onSuccess: () => {
      // 로그아웃 성공 시 모든 쿼리 무효화
      queryClient.clear();
    },
  });
};

// 식당 생성 훅
export const useCreateShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shopData: ShopCreateRequest) => apiClient.createShop(shopData),
    onSuccess: () => {
      // 식당 생성 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["ownerShops"] });
    },
  });
};

// 리뷰 생성 훅
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: ReviewCreateRequest) => {
      const response = await apiClient.createReview(reviewData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // 리뷰 생성 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["shopReviews", variables.shopId],
      });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      queryClient.invalidateQueries({
        queryKey: ["shopDetail", variables.shopId],
      });

      // PreSigned URL 목록 반환
      return data;
    },
  });
};

// 프로필 이미지 PreSigned URL 조회 훅
export const useProfilePresignedUrl = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.getProfilePresignedUrl();
      return response.data;
    },
  });
};

// 이미지 업로드 유틸리티 함수
export const uploadImageToS3 = async (
  file: File,
  presignedUrl: string
): Promise<void> => {
  try {
    await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
  } catch (error) {
    logApiError("이미지 업로드", error);
    throw new Error("이미지 업로드에 실패했습니다.");
  }
};

// 예약 목록 조회 훅 (사장님용)
export const useReservations = (params?: {
  filter?: GetReservationsFilterEnum;
  cursor?: number;
  size?: number;
  shopId?: number;
}) => {
  return useQuery({
    queryKey: ["reservations", params],
    queryFn: async () => {
      const response = await apiClient.getReservations(
        params?.filter,
        params?.cursor,
        params?.size,
        params?.shopId
      );
      return response.data;
    },
    enabled: true,
  });
};

// 예약 수락 훅
export const useConfirmReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: number) => {
      const response = await apiClient.confirmReservation(reservationId);
      return response.data;
    },
    onSuccess: () => {
      // 예약 수락 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["myReservations"] });
    },
  });
};

// 예약 거절 훅
export const useRefuseReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: number) => {
      const response = await apiClient.refuseReservation(reservationId);
      return response.data;
    },
    onSuccess: () => {
      // 예약 거절 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["myReservations"] });
    },
  });
};

// OAuth 관련 훅들
export const useOAuth2Urls = () => {
  return useQuery({
    queryKey: ["oauth2Urls"],
    queryFn: () => apiClient.oauth2Urls(),
  });
};

export const useOAuthSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OAuthSignUpRequest) => apiClient.oauthSignup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    },
  });
};
