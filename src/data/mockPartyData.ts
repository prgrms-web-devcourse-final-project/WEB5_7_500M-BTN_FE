import type { MyPartyResponse } from "@/api/generated";

// 현재 시간 기준으로 상대적 시간 생성
const now = new Date();
const getRelativeTime = (daysAgo: number) => {
  return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
};

// 임시 파티 데이터
export const mockMyParties: MyPartyResponse[] = [
  {
    partyId: 1,
    title: "맛있는 파스타 파티 🍝",
    description: "이탈리안 레스토랑에서 파스타를 함께 먹어요!",
    shopName: "이탈리아노",
    currentCount: 4,
    maxCount: 6,
    minCount: 2,
    metAt: getRelativeTime(2).toISOString(),
    deadline: getRelativeTime(1).toISOString(),

    status: "RECRUITING",
    genderCondition: "A",
    minAge: 20,
    maxAge: 35,
  },
  {
    partyId: 2,
    title: "스테이크 하우스 탐험 🥩",
    description: "프리미엄 스테이크를 맛보러 가요!",
    shopName: "스테이크 하우스",
    currentCount: 2,
    maxCount: 4,
    minCount: 2,
    metAt: getRelativeTime(5).toISOString(),
    deadline: getRelativeTime(3).toISOString(),

    status: "RECRUITING",
    genderCondition: "A",
    minAge: 25,
    maxAge: 40,
  },
  {
    partyId: 3,
    title: "한식 맛집 탐방 🍚",
    description: "전통 한식의 맛을 느껴보세요!",
    shopName: "전통 한식당",
    currentCount: 5,
    maxCount: 8,
    minCount: 3,
    metAt: getRelativeTime(7).toISOString(),
    deadline: getRelativeTime(6).toISOString(),

    status: "RECRUITING",
    genderCondition: "A",
    minAge: 20,
    maxAge: 50,
  },
];
