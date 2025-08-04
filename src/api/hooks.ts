import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  apiClient,
  setAccessToken,
  removeAccessToken,
  refreshAccessToken,
  refreshApiClient,
  getCookie,
  setCookie,
  removeCookie,
  debugCookies,
  getToken,
  getAccessToken,
  axiosInstance,
} from "./client";
import { logApiError, logAuth } from "@/utils/logger";
import { useApiError, useApiErrorHandler } from "@/hooks/useApiError";
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
  BaseResponseInquiryAllGetResponse,
  BaseResponseInquiryOneGetResponse,
  InquiryCreateRequest,
  BaseResponseListCommentResponse,
  CommentCreateRequest,
  BaseResponseShopOwnerDetailResponse,
  ShopUpdateRequest,
} from "./generated";
import { ChatControllerApi } from "./generated";

// ChatControllerApi 인스턴스 생성 - 인증 토큰이 포함된 axios 인스턴스 사용
const chatApi = new ChatControllerApi(undefined, undefined, axiosInstance);

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
  const query = useQuery({
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

  // 자동 에러 처리
  useApiError(query.error, "식당 목록 조회");

  return query;
};

// 식당 검색 훅
export const useShopsBySearch = (params?: {
  query?: string;
  sort?: GetShopsBySearchSortEnum;
  cursor?: string;
  size?: number;
}) => {
  const query = useQuery({
    queryKey: ["shopsBySearch", params],
    queryFn: async () => {
      const response = await apiClient.getShopsBySearch(
        params?.query,
        params?.sort,
        params?.cursor,
        params?.size
      );
      return response.data;
    },
    enabled: !!params?.query && params.query.trim().length > 0,
  });

  // 자동 에러 처리
  useApiError(query.error, "식당 검색");

  return query;
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
  const query = useQuery<BaseResponseMyInfoResponse>({
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
    enabled: !!getAccessToken(),
  });

  // 자동 에러 처리
  useApiError(query.error, "내 정보 조회");

  return query;
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
    enabled: !!getAccessToken(),
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
    enabled: !!getAccessToken(),
  });
};

// 내 리뷰 목록 조회 훅
export const useMyReviews = (params?: { size?: number; cursor?: number }) => {
  return useQuery({
    queryKey: ["myReviews", params],
    queryFn: async () => {
      try {
        const response = await apiClient.getMyReviews(
          params?.size,
          params?.cursor
        );
        return response.data;
      } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
          const apiError = error as { response?: { status?: number } };
          if (apiError.response?.status === 403) {
            // 403 에러는 OAuth 사용자가 추가 정보를 입력하지 않았을 때 발생
            // 추가회원가입 페이지로 리다이렉트
            if (typeof window !== "undefined") {
              window.location.href = "/auth/signup";
            }
          }
        }
        throw error;
      }
    },
    enabled: !!getAccessToken(),
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
    enabled: !!getAccessToken(),
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
  const { handleError } = useApiErrorHandler();

  return useMutation({
    mutationFn: async (loginData: LoginRequest) => {
      try {
        // 초기 쿠키 상태 확인
        logAuth("로그인 시작");
        logAuth("브라우저 환경 정보", {
          protocol:
            typeof window !== "undefined" ? window.location.protocol : "SSR",
          hostname:
            typeof window !== "undefined" ? window.location.hostname : "SSR",
          origin:
            typeof window !== "undefined" ? window.location.origin : "SSR",
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
                    logAuth(
                      "HttpOnly가 아닌 리프레시 토큰 발견, 수동 설정 시도"
                    );
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
      } catch (error) {
        handleError(error, "로그인");
        throw error;
      }
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
  const { handleError } = useApiErrorHandler();

  return useMutation({
    mutationFn: async (params: {
      shopId: number;
      reservationData: CreateReservationRequest;
      partyId?: number;
    }) => {
      try {
        return await apiClient.createReservation(
          params.shopId,
          params.reservationData,
          params.partyId
        );
      } catch (error) {
        handleError(error, "예약 생성");
        throw error;
      }
    },
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
  const { handleError } = useApiErrorHandler();

  return useMutation({
    mutationFn: async (partyData: PartyCreateRequest) => {
      try {
        return await apiClient.createParty(partyData);
      } catch (error) {
        handleError(error, "파티 생성");
        throw error;
      }
    },
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
  const { handleError } = useApiErrorHandler();

  return useMutation({
    mutationFn: async (partyId: number) => {
      try {
        return await apiClient.joinParty(partyId);
      } catch (error) {
        // 에러 처리는 컴포넌트에서 직접 처리하도록 변경
        throw error;
      }
    },
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
    mutationFn: async (partyId: number) => {
      try {
        return await apiClient.quitParty(partyId);
      } catch (error) {
        // 에러 처리는 컴포넌트에서 직접 처리하도록 변경
        throw error;
      }
    },
    onSuccess: () => {
      // 파티 나가기 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      queryClient.invalidateQueries({ queryKey: ["myParties"] });
    },
  });
};

// 파티 모집 완료 훅
export const useCompleteParty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partyId: number) => {
      try {
        return await apiClient.completeParty(partyId);
      } catch (error) {
        // 에러 처리는 컴포넌트에서 직접 처리하도록 변경
        throw error;
      }
    },
    onSuccess: () => {
      // 파티 모집 완료 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      queryClient.invalidateQueries({ queryKey: ["myParties"] });
    },
  });
};

// 파티 댓글 조회 훅
export const usePartyComments = (partyId: number) => {
  return useQuery({
    queryKey: ["partyComments", partyId],
    queryFn: async () => {
      const response = await apiClient.getComments(partyId);
      return response.data;
    },
    enabled: !!partyId,
  });
};

// 파티 댓글 생성 훅
export const useCreatePartyComment = () => {
  const queryClient = useQueryClient();
  const { handleError } = useApiErrorHandler();

  return useMutation({
    mutationFn: async (params: {
      partyId: number;
      commentData: CommentCreateRequest;
    }) => {
      try {
        const response = await apiClient.createComment(
          params.partyId,
          params.commentData
        );
        return response.data;
      } catch (error) {
        handleError(error, "파티 댓글 생성");
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      // 댓글 생성 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["partyComments", variables.partyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["partyDetail", variables.partyId],
      });
    },
  });
};

// 파티 댓글 삭제 훅
export const useDeletePartyComment = () => {
  const queryClient = useQueryClient();
  const { handleError } = useApiErrorHandler();

  return useMutation({
    mutationFn: async (commentId: number) => {
      try {
        const response = await apiClient.deleteComment(commentId);
        return response.data;
      } catch (error) {
        handleError(error, "파티 댓글 삭제");
        throw error;
      }
    },
    onSuccess: () => {
      // 댓글 삭제 성공 시 모든 파티 댓글 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["partyComments"] });
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
    mutationFn: async () => {
      await apiClient.logout();
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
    console.log("이미지 업로드 시작:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      presignedUrl: presignedUrl.substring(0, 50) + "...",
    });

    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
        "Cache-Control": "no-cache,no-store,must-revalidate",
      },
      mode: "cors", // CORS 모드 명시적 설정
    });

    console.log("이미지 업로드 응답:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    console.log("이미지 업로드 성공");
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
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
    enabled: !!getAccessToken(),
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
    queryFn: async () => {
      try {
        const response = await apiClient.oauth2Urls();
        return response.data;
      } catch (error) {
        // OAuth URL이 없을 경우 기본 URL 반환
        return {
          google: "/oauth2/authorization/google",
          kakao: "/oauth2/authorization/kakao",
          naver: "/oauth2/authorization/naver",
        };
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

export const useOAuthSignup = () => {
  const queryClient = useQueryClient();
  const { handleError } = useApiErrorHandler();

  return useMutation({
    mutationFn: async (data: OAuthSignUpRequest) => {
      try {
        const response = await apiClient.oauthSignup(data);
        return response.data;
      } catch (error) {
        handleError(error, "OAuth 회원가입");
        throw error;
      }
    },
    onSuccess: () => {
      // OAuth 회원가입 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    },
  });
};

// 고객센터 관련 훅들

// 문의글 목록 조회 훅
export const useInquiries = (params?: { cursor?: number; size?: number }) => {
  return useQuery({
    queryKey: ["inquiries", params],
    queryFn: async () => {
      const response = await apiClient.getAllInquiry(
        params?.cursor,
        params?.size
      );
      return response.data;
    },
    enabled: !!getAccessToken(),
  });
};

// 문의글 상세 조회 훅
export const useInquiryDetail = (inquiryId: number) => {
  return useQuery({
    queryKey: ["inquiryDetail", inquiryId],
    queryFn: async () => {
      const response = await apiClient.getOneInquiry(inquiryId);
      return response.data;
    },
    enabled: !!inquiryId,
  });
};

// 문의글 생성 훅
export const useCreateInquiry = () => {
  const queryClient = useQueryClient();
  const { handleError } = useApiErrorHandler();

  return useMutation({
    mutationFn: async (inquiryData: InquiryCreateRequest) => {
      try {
        const response = await apiClient.newInquiry(inquiryData);
        return response.data;
      } catch (error) {
        handleError(error, "문의글 생성");
        throw error;
      }
    },
    onSuccess: () => {
      // 문의글 생성 성공 시 관련 쿼리 무효화
      // 새로운 문의글이 첫 페이지에 추가되므로 페이지네이션 상태를 초기화
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
};

// 문의글 댓글 조회 훅
export const useInquiryComments = (inquiryId: number) => {
  return useQuery({
    queryKey: ["inquiryComments", inquiryId],
    queryFn: async () => {
      const response = await apiClient.getInquiryComments(inquiryId);
      return response.data;
    },
    enabled: !!inquiryId,
  });
};

// 문의글 댓글 생성 훅
export const useCreateInquiryComment = () => {
  const queryClient = useQueryClient();
  const { handleError } = useApiErrorHandler();

  return useMutation({
    mutationFn: async (params: {
      inquiryId: number;
      commentData: CommentCreateRequest;
    }) => {
      try {
        const response = await apiClient.createInquiryComment(
          params.inquiryId,
          params.commentData
        );
        return response.data;
      } catch (error) {
        handleError(error, "문의글 댓글 생성");
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      // 댓글 생성 성공 시 해당 문의글의 댓글만 무효화
      queryClient.invalidateQueries({
        queryKey: ["inquiryComments", variables.inquiryId],
      });
      // 문의글 목록은 무효화하지 않음 (페이지네이션 상태 유지)
    },
  });
};

// 채팅 기록 조회 훅
export const useChatHistory = (partyId: number, cursor?: number) => {
  return useQuery({
    queryKey: ["chatHistory", partyId, cursor],
    queryFn: async () => {
      try {
        const response = await chatApi.loadChatHistory(partyId, cursor || 0);
        return response.data;
      } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
          const apiError = error as { response?: { status?: number } };
          if (apiError.response?.status === 401) {
            // 401 에러 시 토큰 갱신 시도 (한 번만)
            try {
              const success = await refreshAccessToken();
              if (success) {
                // 토큰 갱신 성공 시 재시도
                const retryResponse = await chatApi.loadChatHistory(
                  partyId,
                  cursor || 0
                );
                return retryResponse.data;
              }
            } catch (refreshError) {
              logApiError("토큰 갱신 실패:", refreshError);
            }
          }
        }
        throw error;
      }
    },
    enabled: !!partyId,
    retry: false, // 자동 재시도 비활성화
  });
};

// 채팅 복구 훅
export const useRestoreChat = (partyId: number) => {
  return useQuery({
    queryKey: ["restoreChat", partyId],
    queryFn: async () => {
      try {
        const response = await chatApi.restoreChat(partyId);
        return response.data;
      } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
          const apiError = error as { response?: { status?: number } };
          if (apiError.response?.status === 401) {
            // 401 에러 시 토큰 갱신 시도 (한 번만)
            try {
              const success = await refreshAccessToken();
              if (success) {
                // 토큰 갱신 성공 시 재시도
                const retryResponse = await chatApi.restoreChat(partyId);
                return retryResponse.data;
              }
            } catch (refreshError) {
              logApiError("토큰 갱신 실패:", refreshError);
            }
          }
        }
        throw error;
      }
    },
    enabled: !!partyId,
    retry: false, // 자동 재시도 비활성화
  });
};

// 결제내역 조회 훅
export const usePaymentHistories = (params?: { size?: number }) => {
  return useInfiniteQuery({
    queryKey: ["paymentHistories", params?.size],
    queryFn: async ({ pageParam }) => {
      try {
        const response = await apiClient.getPaymentHistories(
          params?.size || 10,
          pageParam
        );
        return response.data;
      } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
          const apiError = error as { response?: { status?: number } };
          if (apiError.response?.status === 401) {
            // 401 에러 시 토큰 갱신 시도 (한 번만)
            try {
              const success = await refreshAccessToken();
              if (success) {
                // 토큰 갱신 성공 시 재시도
                const retryResponse = await apiClient.getPaymentHistories(
                  params?.size || 10,
                  pageParam
                );
                return retryResponse.data;
              }
            } catch (refreshError) {
              logApiError("토큰 갱신 실패:", refreshError);
            }
          }
        }
        throw error;
      }
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.data?.nextCursor,
    retry: false, // 자동 재시도 비활성화
  });
};

// 식당 상세 정보 조회 (소유자용)
export const useShopOwnerDetail = (shopId: number) => {
  return useQuery({
    queryKey: ["shopOwnerDetail", shopId],
    queryFn: async () => {
      try {
        const response = await apiClient.getDetailShopOwner(shopId);
        return response.data;
      } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
          const apiError = error as { response?: { status?: number } };
          if (apiError.response?.status === 401) {
            // 401 에러 시 토큰 갱신 시도 (한 번만)
            try {
              const success = await refreshAccessToken();
              if (success) {
                // 토큰 갱신 성공 시 재시도
                const retryResponse = await apiClient.getDetailShopOwner(
                  shopId
                );
                return retryResponse.data;
              }
            } catch (refreshError) {
              logApiError("토큰 갱신 실패:", refreshError);
            }
          }
        }
        throw error;
      }
    },
    enabled: !!shopId,
    retry: false, // 자동 재시도 비활성화
  });
};

// 식당 정보 수정
export const useUpdateShop = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      shopId,
      shopUpdateRequest,
    }: {
      shopId: number;
      shopUpdateRequest: ShopUpdateRequest;
    }) => {
      try {
        const response = await apiClient.updateShop(shopId, shopUpdateRequest);
        return response.data;
      } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
          const apiError = error as { response?: { status?: number } };
          if (apiError.response?.status === 401) {
            // 401 에러 시 토큰 갱신 시도 (한 번만)
            try {
              const success = await refreshAccessToken();
              if (success) {
                // 토큰 갱신 성공 시 재시도
                const retryResponse = await apiClient.updateShop(
                  shopId,
                  shopUpdateRequest
                );
                return retryResponse.data;
              }
            } catch (refreshError) {
              logApiError("토큰 갱신 실패:", refreshError);
            }
          }
        }
        throw error;
      }
    },
    onSuccess: () => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["ownerShops"] });
      queryClient.invalidateQueries({ queryKey: ["shopOwnerDetail"] });
      queryClient.invalidateQueries({ queryKey: ["shopDetail"] });
    },
  });

  return mutation;
};

// 파티 예약금 지불 훅
export const usePayPartyFee = () => {
  const queryClient = useQueryClient();
  const { handleError } = useApiErrorHandler();

  return useMutation({
    mutationFn: async (partyId: number) => {
      try {
        const response = await apiClient.payPartyFee(partyId);
        return response.data;
      } catch (error) {
        handleError(error, "파티 예약금 지불");
        throw error;
      }
    },
    onSuccess: () => {
      // 파티 예약금 지불 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      queryClient.invalidateQueries({ queryKey: ["myParties"] });
      queryClient.invalidateQueries({ queryKey: ["partyDetail"] });
    },
  });
};
