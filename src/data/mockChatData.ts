import type { ChatMessage, ChatRoomInfo, ChatParticipant } from "@/types/chat";

// 현재 시간 기준으로 상대적 시간 생성
const now = new Date();
const getRelativeTime = (minutesAgo: number) => {
  return new Date(now.getTime() - minutesAgo * 60 * 1000);
};

// 채팅 참여자 목데이터
export const mockParticipants: ChatParticipant[] = [
  {
    id: "user1",
    name: "김철수",
    avatar: "https://i.pravatar.cc/150?img=1",
    isOnline: true,
  },
  {
    id: "user2",
    name: "이영희",
    avatar: "https://i.pravatar.cc/150?img=2",
    isOnline: true,
  },
  {
    id: "user3",
    name: "박민수",
    avatar: "https://i.pravatar.cc/150?img=3",
    isOnline: false,
    lastSeen: getRelativeTime(30),
  },
  {
    id: "user4",
    name: "정수진",
    avatar: "https://i.pravatar.cc/150?img=4",
    isOnline: true,
  },
  {
    id: "user5",
    name: "최동현",
    avatar: "https://i.pravatar.cc/150?img=5",
    isOnline: false,
    lastSeen: getRelativeTime(120),
  },
  {
    id: "me",
    name: "나",
    avatar: "https://i.pravatar.cc/150?img=6",
    isOnline: true,
  },
];

// 채팅방별 메시지 목데이터
export const mockMessages: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "1-1",
      content: "안녕하세요! 맛집 탐험 파티에 오신 것을 환영합니다! 🍽️",
      sender: {
        id: "system",
        name: "시스템",
      },
      timestamp: getRelativeTime(60),
      isMyMessage: false,
    },
    {
      id: "1-2",
      content: "안녕하세요! 저도 참여하게 되어서 기뻐요 😊",
      sender: {
        id: "user1",
        name: "김철수",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      timestamp: getRelativeTime(55),
      isMyMessage: false,
    },
    {
      id: "1-3",
      content: "저도요! 어떤 메뉴가 맛있을까요?",
      sender: {
        id: "user2",
        name: "이영희",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      timestamp: getRelativeTime(50),
      isMyMessage: false,
    },
    {
      id: "1-4",
      content: "저는 파스타를 추천해요! 여기 파스타가 정말 맛있대요 🍝",
      sender: {
        id: "me",
        name: "나",
        avatar: "https://i.pravatar.cc/150?img=6",
      },
      timestamp: getRelativeTime(45),
      isMyMessage: true,
    },
    {
      id: "1-5",
      content: "파스타 좋아요! 저는 피자도 먹어보고 싶어요 🍕",
      sender: {
        id: "user3",
        name: "박민수",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      timestamp: getRelativeTime(40),
      isMyMessage: false,
    },
    {
      id: "1-6",
      content: "피자도 맛있대요! 특히 트러플 피자가 인기래요",
      sender: {
        id: "user4",
        name: "정수진",
        avatar: "https://i.pravatar.cc/150?img=4",
      },
      timestamp: getRelativeTime(35),
      isMyMessage: false,
    },
    {
      id: "1-7",
      content: "그럼 파스타랑 피자 둘 다 주문해볼까요?",
      sender: {
        id: "me",
        name: "나",
        avatar: "https://i.pravatar.cc/150?img=6",
      },
      timestamp: getRelativeTime(30),
      isMyMessage: true,
    },
    {
      id: "1-8",
      content: "좋은 아이디어네요! 저도 동의해요 👍",
      sender: {
        id: "user1",
        name: "김철수",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      timestamp: getRelativeTime(25),
      isMyMessage: false,
    },
    {
      id: "1-9",
      content: "저도 동의합니다! 드디어 맛있는 음식 먹을 수 있겠어요 😋",
      sender: {
        id: "user2",
        name: "이영희",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      timestamp: getRelativeTime(20),
      isMyMessage: false,
    },
    {
      id: "1-10",
      content: "그럼 예약 시간에 맞춰서 만나요!",
      sender: {
        id: "me",
        name: "나",
        avatar: "https://i.pravatar.cc/150?img=6",
      },
      timestamp: getRelativeTime(15),
      isMyMessage: true,
    },
  ],
  "2": [
    {
      id: "2-1",
      content: "안녕하세요! 맛집 탐험 파티에 오신 것을 환영합니다! 🍽️",
      sender: {
        id: "system",
        name: "시스템",
      },
      timestamp: getRelativeTime(120),
      isMyMessage: false,
    },
    {
      id: "2-2",
      content: "안녕하세요! 저도 참여하게 되어서 기뻐요 😊",
      sender: {
        id: "user5",
        name: "최동현",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      timestamp: getRelativeTime(115),
      isMyMessage: false,
    },
    {
      id: "2-3",
      content: "저도요! 어떤 메뉴가 맛있을까요?",
      sender: {
        id: "me",
        name: "나",
        avatar: "https://i.pravatar.cc/150?img=6",
      },
      timestamp: getRelativeTime(110),
      isMyMessage: true,
    },
    {
      id: "2-4",
      content: "저는 스테이크를 추천해요! 여기 스테이크가 정말 맛있대요 🥩",
      sender: {
        id: "user5",
        name: "최동현",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      timestamp: getRelativeTime(105),
      isMyMessage: false,
    },
  ],
  "3": [
    {
      id: "3-1",
      content: "안녕하세요! 맛집 탐험 파티에 오신 것을 환영합니다! 🍽️",
      sender: {
        id: "system",
        name: "시스템",
      },
      timestamp: getRelativeTime(180),
      isMyMessage: false,
    },
    {
      id: "3-2",
      content: "안녕하세요! 저도 참여하게 되어서 기뻐요 😊",
      sender: {
        id: "user1",
        name: "김철수",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      timestamp: getRelativeTime(175),
      isMyMessage: false,
    },
    {
      id: "3-3",
      content: "저도요! 어떤 메뉴가 맛있을까요?",
      sender: {
        id: "user2",
        name: "이영희",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      timestamp: getRelativeTime(170),
      isMyMessage: false,
    },
    {
      id: "3-4",
      content: "저는 파스타를 추천해요! 여기 파스타가 정말 맛있대요 🍝",
      sender: {
        id: "me",
        name: "나",
        avatar: "https://i.pravatar.cc/150?img=6",
      },
      timestamp: getRelativeTime(165),
      isMyMessage: true,
    },
    {
      id: "3-5",
      content: "파스타 좋아요! 저는 피자도 먹어보고 싶어요 🍕",
      sender: {
        id: "user3",
        name: "박민수",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      timestamp: getRelativeTime(160),
      isMyMessage: false,
    },
    {
      id: "3-6",
      content: "피자도 맛있대요! 특히 트러플 피자가 인기래요",
      sender: {
        id: "user4",
        name: "정수진",
        avatar: "https://i.pravatar.cc/150?img=4",
      },
      timestamp: getRelativeTime(155),
      isMyMessage: false,
    },
    {
      id: "3-7",
      content: "그럼 파스타랑 피자 둘 다 주문해볼까요?",
      sender: {
        id: "me",
        name: "나",
        avatar: "https://i.pravatar.cc/150?img=6",
      },
      timestamp: getRelativeTime(150),
      isMyMessage: true,
    },
    {
      id: "3-8",
      content: "좋은 아이디어네요! 저도 동의해요 👍",
      sender: {
        id: "user1",
        name: "김철수",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      timestamp: getRelativeTime(145),
      isMyMessage: false,
    },
    {
      id: "3-9",
      content: "저도 동의합니다! 드디어 맛있는 음식 먹을 수 있겠어요 😋",
      sender: {
        id: "user2",
        name: "이영희",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      timestamp: getRelativeTime(140),
      isMyMessage: false,
    },
    {
      id: "3-10",
      content: "그럼 예약 시간에 맞춰서 만나요!",
      sender: {
        id: "me",
        name: "나",
        avatar: "https://i.pravatar.cc/150?img=6",
      },
      timestamp: getRelativeTime(135),
      isMyMessage: true,
    },
    {
      id: "3-11",
      content: "네! 정말 기대되네요 😊",
      sender: {
        id: "user1",
        name: "김철수",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      timestamp: getRelativeTime(130),
      isMyMessage: false,
    },
    {
      id: "3-12",
      content: "저도 기대돼요! 맛있는 음식 먹으면서 좋은 시간 보내요 🍽️",
      sender: {
        id: "user2",
        name: "이영희",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      timestamp: getRelativeTime(125),
      isMyMessage: false,
    },
  ],
};

// 채팅방 정보 목데이터
export const mockChatRooms: Record<string, ChatRoomInfo> = {
  "1": {
    partyId: "1",
    lastMessage: "그럼 예약 시간에 맞춰서 만나요!",
    lastMessageTime: getRelativeTime(15),
    unreadCount: 2,
    onlineCount: 4,
    participants: [
      mockParticipants[0],
      mockParticipants[1],
      mockParticipants[2],
      mockParticipants[3],
      mockParticipants[5],
    ],
  },
  "2": {
    partyId: "2",
    lastMessage: "저는 스테이크를 추천해요! 여기 스테이크가 정말 맛있대요 🥩",
    lastMessageTime: getRelativeTime(105),
    unreadCount: 0,
    onlineCount: 1,
    participants: [mockParticipants[4], mockParticipants[5]],
  },
  "3": {
    partyId: "3",
    lastMessage: "저도 기대돼요! 맛있는 음식 먹으면서 좋은 시간 보내요 🍽️",
    lastMessageTime: getRelativeTime(125),
    unreadCount: 5,
    onlineCount: 3,
    participants: [
      mockParticipants[0],
      mockParticipants[1],
      mockParticipants[2],
      mockParticipants[3],
      mockParticipants[5],
    ],
  },
};

// 채팅 관련 유틸리티 함수들
export const getChatMessages = (partyId: string): ChatMessage[] => {
  return mockMessages[partyId] || [];
};

export const getChatRoomInfo = (partyId: string): ChatRoomInfo | null => {
  return mockChatRooms[partyId] || null;
};

export const getUnreadCount = (partyId: string): number => {
  return mockChatRooms[partyId]?.unreadCount || 0;
};

export const getTotalUnreadCount = (): number => {
  return Object.values(mockChatRooms).reduce(
    (total, room) => total + room.unreadCount,
    0
  );
};

export const getOnlineCount = (partyId: string): number => {
  return mockChatRooms[partyId]?.onlineCount || 0;
};
