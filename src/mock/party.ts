import { SimpleRestaurant, simpleRestaurants } from "./restaurant";
import { SimpleUser, simpleUsers } from "./user";

export type SimpleParty = {
  id: string;
  name: string;
  dateTime: string;
  restaurant: SimpleRestaurant;
  users: SimpleUser[];
};

export const simpleParties: SimpleParty[] = [
  {
    id: "1",
    name: "점심 김밥 원정대",
    dateTime: "2024-06-10T12:30:00",
    restaurant: simpleRestaurants[0],
    users: [simpleUsers[0], simpleUsers[1], simpleUsers[2]],
  },
  {
    id: "2",
    name: "저녁 한식 모임",
    dateTime: "2024-06-11T18:00:00",
    restaurant: simpleRestaurants[1],
    users: [simpleUsers[1], simpleUsers[3], simpleUsers[4]],
  },
  {
    id: "3",
    name: "이탈리안 파티",
    dateTime: "2024-06-12T19:00:00",
    restaurant: simpleRestaurants[2],
    users: [simpleUsers[0], simpleUsers[2], simpleUsers[4]],
  },
];
