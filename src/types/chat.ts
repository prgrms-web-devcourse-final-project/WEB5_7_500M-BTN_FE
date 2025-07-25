// 채팅 메시지 타입
export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  isMyMessage: boolean;
}

// 채팅방 정보 타입
export interface ChatRoomInfo {
  partyId: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  onlineCount: number;
  participants: ChatParticipant[];
}

// 채팅 참여자 타입
export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

// 파티 정보 타입 (채팅용)
export interface PartyInfo {
  id: string;
  title: string;
  shopName: string;
  currentCount: number;
  maxCount: number;
  metAt: Date;
  status: "RECRUITING" | "COMPLETED" | "CANCELLED";
}
