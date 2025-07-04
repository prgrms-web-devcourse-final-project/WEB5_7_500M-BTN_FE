export type SimpleUser = {
  id: string;
  name: string;
  nickname: string;
  username: string;
  profileImage: string;
};

export const simpleUsers: SimpleUser[] = [
  {
    id: "1",
    name: "홍길동",
    nickname: "길동이",
    username: "hong123",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "김영희",
    nickname: "영희짱",
    username: "kimyh",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "3",
    name: "이철수",
    nickname: "철수형",
    username: "leecs",
    profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "4",
    name: "박민수",
    nickname: "민수",
    username: "parkms",
    profileImage: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: "5",
    name: "최지은",
    nickname: "지은이",
    username: "choije",
    profileImage: "https://randomuser.me/api/portraits/women/5.jpg",
  },
];
