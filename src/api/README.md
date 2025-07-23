# API 클라이언트 사용법

이 프로젝트는 OpenAPI Generator를 사용하여 자동 생성된 TypeScript API 클라이언트와 React Query 훅을 제공합니다.

## 설치된 패키지

- `@openapitools/openapi-generator-cli`: OpenAPI 스펙에서 TypeScript 클라이언트 생성
- `@tanstack/react-query`: React Query 상태 관리
- `@tanstack/react-query-devtools`: React Query 개발 도구

## 파일 구조

```
src/api/
├── generated/           # OpenAPI Generator로 생성된 파일들
│   ├── src/
│   │   ├── apis/       # API 클라이언트
│   │   ├── models/     # 타입 정의
│   │   └── runtime.ts  # 런타임 설정
├── client.ts           # API 클라이언트 설정
├── hooks.ts            # React Query 훅들
├── example.tsx         # 사용 예시
└── README.md           # 이 파일
```

## API 클라이언트 재생성

API 스펙이 변경되었을 때 클라이언트를 재생성하려면:

```bash
pnpm run generate-api
```

## 사용법

### 1. 기본 설정

앱의 루트 레이아웃에서 QueryProvider가 이미 설정되어 있습니다.

### 2. 데이터 조회 (Query)

```tsx
import { useShops, useParties, useMyInfo } from "@/api/hooks";

// 식당 목록 조회
const { data, isLoading, error } = useShops({
  size: 10,
  category: ["KOREAN", "JAPANESE"],
});

// 파티 목록 조회
const { data, isLoading, error } = useParties({
  status: "RECRUITING",
  size: 10,
});

// 내 정보 조회
const { data, isLoading, error } = useMyInfo();
```

### 3. 데이터 수정 (Mutation)

```tsx
import { useLogin, useCreateReservation } from "@/api/hooks";

// 로그인
const loginMutation = useLogin();
const handleLogin = () => {
  loginMutation.mutate({
    email: "user@example.com",
    password: "password123",
  });
};

// 예약 생성
const createReservationMutation = useCreateReservation();
const handleReservation = () => {
  createReservationMutation.mutate({
    shopId: 1,
    reservationData: {
      date: "2024-06-15",
      time: "18:00",
      headCount: 4,
      reservationFee: 1000,
    },
  });
};
```

### 4. 로딩 및 에러 상태 처리

```tsx
const { data, isLoading, error, isError } = useShops();

if (isLoading) return <CircularProgress />;
if (isError) return <Alert severity="error">{error.message}</Alert>;

return (
  <div>
    {data?.data?.content?.map((shop) => (
      <div key={shop.shopId}>{shop.shopName}</div>
    ))}
  </div>
);
```

## 사용 가능한 훅들

### Query 훅들

- `useShops(request?)`: 식당 목록 조회
- `useParties(request?)`: 파티 목록 조회
- `useMyInfo()`: 내 정보 조회
- `useMyReservations(request?)`: 내 예약 목록 조회
- `useMyParties(request?)`: 내 파티 목록 조회
- `useMyReviews(request?)`: 내 리뷰 목록 조회

### Mutation 훅들

- `useLogin()`: 로그인
- `useSignUp()`: 회원가입
- `useCreateReservation()`: 예약 생성
- `useCreateParty()`: 파티 생성
- `useJoinParty()`: 파티 참여
- `useQuitParty()`: 파티 나가기
- `useUpdateMyInfo()`: 내 정보 수정
- `useLogout()`: 로그아웃

## 인증 토큰 관리

API 클라이언트는 자동으로 localStorage에서 액세스 토큰을 가져와 요청 헤더에 포함시킵니다.

```tsx
import { setAccessToken, removeAccessToken } from "@/api/client";

// 로그인 성공 시
setAccessToken("your-access-token");

// 로그아웃 시
removeAccessToken();
```

## 환경 변수

`.env.local` 파일에서 API 기본 URL을 설정할 수 있습니다:

```
NEXT_PUBLIC_API_BASE_URL=https://matjalalzz.shop
```

## 개발 도구

React Query Devtools가 개발 모드에서 자동으로 활성화됩니다. 브라우저에서 쿼리 상태를 확인할 수 있습니다.

## 주의사항

1. API 스펙이 변경되면 `pnpm run generate-api`를 실행하여 클라이언트를 재생성하세요.
2. 생성된 파일들은 수정하지 마세요. 재생성 시 변경사항이 사라집니다.
3. 커스텀 로직이 필요한 경우 `hooks.ts`에 추가하세요.
