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
