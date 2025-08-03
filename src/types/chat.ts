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

// 웹소켓 메시지 타입
export interface WebSocketMessage {
  id: number;
  sendAt: string;
  type:
    | "CHAT"
    | "JOIN"
    | "LEAVE"
    | "PAYMENT_REQUEST"
    | "PAYMENT_COMPLETE"
    | "RESERVATION_COMPLETE"
    | "PARTY_DELETED"
    | "ERROR"
    | "KICK";
  message: string | null;
  userId: number;
  userNickname: string;
  userProfile: string;
  partyId: number;
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

// 웹소켓 연결 상태
export type WebSocketStatus =
  | "CONNECTING"
  | "CONNECTED"
  | "DISCONNECTED"
  | "ERROR";

// 웹소켓 메시지 전송 타입
export interface SendMessagePayload {
  message: string;
  partyId: number;
}
