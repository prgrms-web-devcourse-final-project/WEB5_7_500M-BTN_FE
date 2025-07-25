import { CustomerInquiry } from "@/types";

export const mockInquiries: CustomerInquiry[] = [
  {
    id: 1,
    title: "예약 취소가 안됩니다",
    content:
      "어제 예약한 식당인데 취소 버튼이 눌리지 않아요. 어떻게 해야 하나요?",
    images: ["/api/mock/inquiry/1/image1.jpg"],
    status: "answered",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    answer: {
      content:
        "안녕하세요. 예약 취소 관련 문의주셔서 감사합니다. 예약 취소는 예약일 하루 전까지 가능합니다. 현재 상황을 확인해보니 예약일이 오늘이라 취소가 불가능한 상태입니다. 추가 문의사항이 있으시면 언제든 연락주세요.",
      createdAt: "2024-01-15T14:20:00Z",
    },
  },
  {
    id: 2,
    title: "포인트 적립이 안됐어요",
    content:
      "지난주에 식당에서 결제했는데 포인트가 적립되지 않았습니다. 확인 부탁드립니다.",
    images: ["/api/mock/inquiry/2/receipt.jpg"],
    status: "pending",
    createdAt: "2024-01-14T16:45:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
  },
  {
    id: 3,
    title: "앱 로그인이 안돼요",
    content:
      "아이디와 비밀번호를 정확히 입력했는데도 로그인이 안됩니다. 계정이 잠겼나요?",
    status: "answered",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T11:30:00Z",
    answer: {
      content:
        "로그인 문제 확인해보겠습니다. 먼저 비밀번호 재설정을 시도해보시고, 그래도 안되시면 고객센터로 전화주세요. 02-1234-5678",
      createdAt: "2024-01-13T11:30:00Z",
    },
  },
  {
    id: 4,
    title: "파티 모집 기능 문의",
    content:
      "파티 모집할 때 최대 인원 수를 설정할 수 있나요? 그리고 파티원들의 연령대도 제한할 수 있나요?",
    status: "closed",
    createdAt: "2024-01-12T20:30:00Z",
    updatedAt: "2024-01-12T22:15:00Z",
    answer: {
      content:
        "네, 파티 모집 시 최대 인원 수와 연령대 제한을 모두 설정할 수 있습니다. 파티 생성 페이지에서 '상세 설정' 옵션을 확인해보세요.",
      createdAt: "2024-01-12T22:15:00Z",
    },
  },
  {
    id: 5,
    title: "결제 오류 발생",
    content:
      "카드 결제 중에 오류가 발생했습니다. 결제는 되지 않았는데 예약이 완료되었다고 나와요.",
    images: [
      "/api/mock/inquiry/5/error.jpg",
      "/api/mock/inquiry/5/payment.jpg",
    ],
    status: "pending",
    createdAt: "2024-01-11T14:20:00Z",
    updatedAt: "2024-01-11T14:20:00Z",
  },
];

export const getMockInquiries = (page: number = 1, size: number = 10) => {
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedInquiries = mockInquiries.slice(startIndex, endIndex);

  return {
    inquiries: paginatedInquiries,
    totalCount: mockInquiries.length,
    hasNext: endIndex < mockInquiries.length,
  };
};
