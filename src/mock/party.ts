import { SimpleShop, simpleShops } from "./shop";
import { SimpleUser, simpleUsers } from "./user";

export type SimpleParty = {
  id: string;
  name: string;
  dateTime: string;
  shop: SimpleShop;
  currentUserCount: number;
  minUserCount: number;
  maxUserCount: number;
};

export const simpleParties: SimpleParty[] = [
  {
    id: "1",
    name: "점심 김밥 원정대",
    dateTime: "2024-06-10T12:30:00",
    shop: simpleShops[0],
    currentUserCount: 2,
    minUserCount: 2,
    maxUserCount: 5,
  },
  {
    id: "2",
    name: "저녁 한식 모임",
    dateTime: "2024-06-11T18:00:00",
    shop: simpleShops[1],
    currentUserCount: 3,
    minUserCount: 2,
    maxUserCount: 5,
  },
  {
    id: "3",
    name: "이탈리안 파티",
    dateTime: "2024-06-12T19:00:00",
    shop: simpleShops[2],
    currentUserCount: 1,
    minUserCount: 2,
    maxUserCount: 5,
  },
  // 이미 다녀온(종료된) 파티
  {
    id: "4",
    name: "지난주 분식 파티",
    dateTime: "2024-05-30T18:00:00", // 과거 날짜
    shop: simpleShops[5],
    currentUserCount: 4,
    minUserCount: 2,
    maxUserCount: 6,
  },
  // 인원이 가득 찬(마감) 파티
  {
    id: "5",
    name: "스시 오마카세 런치",
    dateTime: "2024-06-15T12:00:00",
    shop: simpleShops[3],
    currentUserCount: 4,
    minUserCount: 2,
    maxUserCount: 4, // currentUserCount === maxUserCount
  },
  // 종료되지 않은(미래, 모집중) 파티
  {
    id: "6",
    name: "곧 떠나는 중식 투어",
    dateTime: "2025-07-20T18:30:00",
    shop: simpleShops[4],
    currentUserCount: 2,
    minUserCount: 2,
    maxUserCount: 5,
  },
];

export type PartyComment = {
  id: string;
  partyId: string;
  author: SimpleUser;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export const partyComments: Record<string, PartyComment[]> = {
  "1": [
    {
      id: "c1",
      partyId: "1",
      author: simpleUsers[0],
      content: "저도 김밥 엄청 좋아해요! 같이 가고 싶어요~",
      createdAt: "2024-06-08T10:00:00",
      updatedAt: "2024-06-08T10:00:00",
    },
    {
      id: "c2",
      partyId: "1",
      author: simpleUsers[1],
      content: "혹시 채식 김밥도 있나요?",
      createdAt: "2024-06-08T11:00:00",
      updatedAt: "2024-06-08T11:00:00",
    },
  ],
  "2": [
    {
      id: "c3",
      partyId: "2",
      author: simpleUsers[2],
      content: "한식 모임 너무 기대돼요!",
      createdAt: "2024-06-09T09:30:00",
      updatedAt: "2024-06-09T09:30:00",
    },
  ],
  "3": [],
};
