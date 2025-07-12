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
];
