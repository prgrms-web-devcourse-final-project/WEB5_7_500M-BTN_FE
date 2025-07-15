import type { SimpleUser } from "@/mock/user";
import { simpleUsers } from "@/mock/user";

export type ReservationStatus = "예약 완료" | "방문 완료" | "취소됨";

export type Reservation = {
  id: string;
  customer: SimpleUser;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  people: number;
  status: ReservationStatus;
  phone: string;
  memo?: string;
};

export const reservations: Reservation[] = [
  {
    id: "r1",
    customer: simpleUsers[0],
    date: "2024-06-01",
    time: "18:00",
    people: 4,
    status: "예약 완료",
    phone: "010-1234-5678",
    memo: "창가 자리 부탁드려요.",
  },
  {
    id: "r2",
    customer: simpleUsers[1],
    date: "2024-06-02",
    time: "12:30",
    people: 2,
    status: "방문 완료",
    phone: "010-9876-5432",
  },
  {
    id: "r3",
    customer: simpleUsers[2],
    date: "2024-06-03",
    time: "19:00",
    people: 6,
    status: "취소됨",
    phone: "010-5555-6666",
    memo: "단체석 요청",
  },
];
