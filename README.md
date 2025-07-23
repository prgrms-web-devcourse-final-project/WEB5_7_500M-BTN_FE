# 맛잘알즈 - 맛집 탐험 파티 플랫폼 🍽️

주변의 숨겨진 맛집을 찾고, 새로운 맛의 경험을 함께할 수 있는 맛집 탐험 파티 플랫폼입니다.

## ✨ 주요 기능

### 🏪 식당 시스템

- **식당 검색 및 필터링**: 지역, 카테고리, 평점별 검색
- **식당 상세 정보**: 이미지 갤러리, 리뷰, 영업시간, 위치 정보
- **예약 시스템**: 날짜/시간 선택, 인원 선택, 결제 연동
- **리뷰 시스템**: 별점, 텍스트 리뷰, 이미지 업로드

### 👥 파티 시스템

- **파티 생성**: 카카오맵 연동으로 식당 선택
- **파티 참여/나가기**: 조건별 필터링 (성별, 나이, 인원)
- **파티 상세 정보**: 참여자 정보, 모임 일정, 위치

### 🏪 사장님 기능

- **식당 등록/관리**: 카카오맵 연동, 이미지 업로드
- **예약 현황 관리**: 예약 수락/거절, 상태 관리
- **매출 통계**: 예약 현황 및 수익 관리

### 👤 사용자 시스템

- **OAuth 로그인**: Google, Kakao, Naver 연동
- **프로필 관리**: 정보 수정, 예약/파티 내역
- **결제 시스템**: Toss Payments 연동

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, TypeScript, Material-UI
- **State Management**: React Query (TanStack Query)
- **Payment**: Toss Payments
- **Map**: Kakao Maps API
- **Authentication**: OAuth 2.0
- **Styling**: Emotion, Material-UI Theme

## 🚀 시작하기

### 1. 환경 설정

```bash
# 저장소 클론
git clone [repository-url]
cd web5_7_500m-btn_fe

# 의존성 설치
pnpm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Toss Payments
NEXT_PUBLIC_TOSS_CLIENT_KEY=your_toss_client_key

# Kakao Maps
NEXT_PUBLIC_KAKAO_API_KEY=your_kakao_api_key

# API Base URL
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

### 3. 개발 서버 실행

```bash
# 개발 서버 시작
pnpm dev

# 브라우저에서 http://localhost:3000 접속
```

### 4. API 코드 생성

```bash
# API 스키마에서 TypeScript 코드 생성
pnpm generate-api
```

## 📱 주요 페이지

### 홈페이지 (`/`)

- 배너 검색 기능
- 추천 식당 목록
- 인기 파티 목록

### 식당 목록 (`/shop`)

- 지도 기반 식당 검색
- 카테고리별 필터링
- 실시간 검색

### 파티 목록 (`/party`)

- 파티 생성/참여
- 조건별 필터링
- 파티 상세 정보

### 프로필 (`/profile`)

- 사용자 정보 수정
- 예약 내역 관리
- 파티 내역 관리

### 사장님 페이지 (`/my-shop`)

- 식당 등록/관리
- 예약 현황 관리

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **Material Design**: 일관된 디자인 시스템
- **실시간 피드백**: 토스트 알림, 로딩 상태
- **직관적인 네비게이션**: 명확한 메뉴 구조

## 🔧 개발 가이드

### 컴포넌트 구조

```
src/
├── app/                 # Next.js App Router
│   ├── (Auth)/         # 인증 관련 페이지
│   ├── (Main)/         # 메인 페이지들
│   └── api/            # API 라우트
├── features/           # 기능별 컴포넌트
│   ├── common/         # 공통 컴포넌트
│   ├── party/          # 파티 관련 컴포넌트
│   └── shop/           # 식당 관련 컴포넌트
├── api/                # API 클라이언트
└── utils/              # 유틸리티 함수
```

### API 훅 사용법

```typescript
import { useShops, useCreateReservation } from "@/api/hooks";

// 식당 목록 조회
const { data: shops, isLoading } = useShops({ size: 10 });

// 예약 생성
const createReservation = useCreateReservation();
await createReservation.mutateAsync(reservationData);
```

## 🚀 배포

### Vercel 배포 (권장)

1. Vercel 계정 생성
2. GitHub 저장소 연결
3. 환경 변수 설정
4. 자동 배포

### 수동 배포

```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 서버 시작
pnpm start
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**맛잘알즈**와 함께 맛있는 발견을 시작하세요! 🍜✨
