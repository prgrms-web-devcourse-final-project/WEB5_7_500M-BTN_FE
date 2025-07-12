export type SimpleShop = {
  id: string;
  thumbnail: string;
  name: string;
  address: string;
};

export const simpleShops: SimpleShop[] = [
  {
    id: "1",
    thumbnail:
      "https://cdn.pixabay.com/photo/2022/03/18/00/16/dish-7075619_1280.jpg",
    name: "맛있는 김밥천국",
    address: "서울특별시 강남구 테헤란로 1길 10",
  },
  {
    id: "2",
    thumbnail:
      "https://cdn.pixabay.com/photo/2018/11/26/02/25/kimchi-3838674_1280.jpg",
    name: "한식의 품격",
    address: "서울특별시 마포구 양화로 20",
  },
  {
    id: "3",
    thumbnail:
      "https://cdn.pixabay.com/photo/2023/07/26/16/43/food-8151625_1280.jpg",
    name: "이탈리안 하우스",
    address: "서울특별시 종로구 종로 100",
  },
  {
    id: "4",
    thumbnail:
      "https://cdn.pixabay.com/photo/2017/10/16/09/00/sushi-2856545_1280.jpg",
    name: "스시 오마카세",
    address: "서울특별시 서초구 반포대로 50",
  },
  {
    id: "5",
    thumbnail:
      "https://cdn.pixabay.com/photo/2018/04/26/08/01/food-3351333_1280.jpg",
    name: "중화요리 대가",
    address: "서울특별시 동대문구 왕산로 30",
  },
  {
    id: "6",
    thumbnail:
      "https://cdn.pixabay.com/photo/2022/12/29/01/01/image-7683986_1280.jpg",
    name: "분식왕국",
    address: "서울특별시 송파구 올림픽로 300",
  },
];

export type ShopListItem = SimpleShop & {
  rating: number;
  category: "한식" | "일식" | "중식" | "양식" | "기타";
};

export const shopListItems: ShopListItem[] = [
  {
    id: "1",
    thumbnail:
      "https://cdn.pixabay.com/photo/2022/03/18/00/16/dish-7075619_1280.jpg",
    name: "맛있는 김밥천국",
    address: "서울특별시 강남구 테헤란로 1길 10",
    rating: 4.3,
    category: "한식",
  },
  {
    id: "2",
    thumbnail:
      "https://cdn.pixabay.com/photo/2018/11/26/02/25/kimchi-3838674_1280.jpg",
    name: "한식의 품격",
    address: "서울특별시 마포구 양화로 20",
    rating: 4.7,
    category: "한식",
  },
  {
    id: "3",
    thumbnail:
      "https://cdn.pixabay.com/photo/2023/07/26/16/43/food-8151625_1280.jpg",
    name: "이탈리안 하우스",
    address: "서울특별시 종로구 종로 100",
    rating: 4.5,
    category: "양식",
  },
  {
    id: "4",
    thumbnail:
      "https://cdn.pixabay.com/photo/2017/10/16/09/00/sushi-2856545_1280.jpg",
    name: "스시 오마카세",
    address: "서울특별시 서초구 반포대로 50",
    rating: 4.8,
    category: "일식",
  },
  {
    id: "5",
    thumbnail:
      "https://cdn.pixabay.com/photo/2018/04/26/08/01/food-3351333_1280.jpg",
    name: "중화요리 대가",
    address: "서울특별시 동대문구 왕산로 30",
    rating: 4.2,
    category: "중식",
  },
  {
    id: "6",
    thumbnail:
      "https://cdn.pixabay.com/photo/2022/12/29/01/01/image-7683986_1280.jpg",
    name: "분식왕국",
    address: "서울특별시 송파구 올림픽로 300",
    rating: 4.0,
    category: "한식",
  },
];

export type ShopItem = ShopListItem & {
  description: string;
  businessHours: string; // 예: "17:00 - 24:00"
  contact: string;
  thumbnailList: string[];
};

export const shopItems: ShopItem[] = [
  {
    ...shopListItems[0],
    description:
      "신선한 재료로 만든 다양한 김밥과 분식 메뉴를 즐길 수 있는 곳입니다.",
    businessHours: "08:00 - 22:00",
    contact: "02-123-4567",
    thumbnailList: [
      "https://cdn.pixabay.com/photo/2022/03/18/00/16/dish-7075619_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/11/26/02/25/kimchi-3838674_1280.jpg",
    ],
  },
  {
    ...shopListItems[1],
    description: "정성 가득한 한식 요리를 맛볼 수 있는 전통 한식당입니다.",
    businessHours: "11:00 - 21:00",
    contact: "02-234-5678",
    thumbnailList: [
      "https://cdn.pixabay.com/photo/2018/11/26/02/25/kimchi-3838674_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/11/18/15/07/abstract-1839106_1280.jpg",
    ],
  },
  {
    ...shopListItems[2],
    description:
      "이탈리아 정통 요리를 합리적인 가격에 즐길 수 있는 레스토랑입니다.",
    businessHours: "17:00 - 24:00",
    contact: "02-345-6789",
    thumbnailList: [
      "https://cdn.pixabay.com/photo/2023/07/26/16/43/food-8151625_1280.jpg",
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/06/02/18/24/salad-2367020_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/11/18/15/07/abstract-1839106_1280.jpg",
    ],
  },
];

// User 타입 import (user mock 참고)
import type { SimpleUser } from "@/mock/user";

export type ShopReview = {
  id: string;
  author: SimpleUser;
  createdAt: string;
  updatedAt: string;
  rating: number;
  contents: string;
  imageList: string[];
};

// 샘플 유저 import
import { simpleUsers } from "@/mock/user";

export const shopReviews: ShopReview[] = [
  {
    id: "r1",
    author: simpleUsers[0],
    createdAt: "2024-06-01T12:00:00Z",
    updatedAt: "2024-06-01T12:00:00Z",
    rating: 4.5,
    contents: "정말 맛있고 친절했어요! 김밥이 신선하고 양도 많아요.",
    imageList: [
      "https://cdn.pixabay.com/photo/2022/03/18/00/16/dish-7075619_1280.jpg",
    ],
  },
  {
    id: "r2",
    author: simpleUsers[1],
    createdAt: "2024-06-02T15:30:00Z",
    updatedAt: "2024-06-02T15:30:00Z",
    rating: 5.0,
    contents: "분위기도 좋고 음식도 훌륭합니다. 재방문 의사 있어요!",
    imageList: [
      "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/06/02/18/24/salad-2367020_1280.jpg",
    ],
  },
  {
    id: "r3",
    author: simpleUsers[2],
    createdAt: "2024-06-03T10:20:00Z",
    updatedAt: "2024-06-03T10:20:00Z",
    rating: 4.0,
    contents: "가격 대비 만족도가 높아요. 추천합니다!",
    imageList: [],
  },
];
