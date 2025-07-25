// 임시 파티원 타입
export interface PartyMember {
  id: string;
  name: string;
  avatar?: string;
  isHost: boolean;
  joinedAt: Date;
  isOnline: boolean;
}

// 현재 시간 기준으로 상대적 시간 생성
const now = new Date();
const getRelativeTime = (daysAgo: number) => {
  return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
};

// 파티별 파티원 목데이터
export const mockPartyMembers: Record<string, PartyMember[]> = {
  "1": [
    {
      id: "host1",
      name: "김파티장",
      avatar: "https://i.pravatar.cc/150?img=10",
      isHost: true,
      joinedAt: getRelativeTime(5),
      isOnline: true,
    },
    {
      id: "user1",
      name: "김철수",
      avatar: "https://i.pravatar.cc/150?img=1",
      isHost: false,
      joinedAt: getRelativeTime(3),
      isOnline: true,
    },
    {
      id: "user2",
      name: "이영희",
      avatar: "https://i.pravatar.cc/150?img=2",
      isHost: false,
      joinedAt: getRelativeTime(2),
      isOnline: true,
    },
    {
      id: "user3",
      name: "박민수",
      avatar: "https://i.pravatar.cc/150?img=3",
      isHost: false,
      joinedAt: getRelativeTime(1),
      isOnline: false,
    },
    {
      id: "user4",
      name: "정수진",
      avatar: "https://i.pravatar.cc/150?img=4",
      isHost: false,
      joinedAt: getRelativeTime(1),
      isOnline: true,
    },
    {
      id: "me",
      name: "나",
      avatar: "https://i.pravatar.cc/150?img=6",
      isHost: false,
      joinedAt: getRelativeTime(1),
      isOnline: true,
    },
  ],
  "2": [
    {
      id: "host2",
      name: "이파티장",
      avatar: "https://i.pravatar.cc/150?img=11",
      isHost: true,
      joinedAt: getRelativeTime(7),
      isOnline: false,
    },
    {
      id: "user5",
      name: "최동현",
      avatar: "https://i.pravatar.cc/150?img=5",
      isHost: false,
      joinedAt: getRelativeTime(5),
      isOnline: false,
    },
    {
      id: "me",
      name: "나",
      avatar: "https://i.pravatar.cc/150?img=6",
      isHost: false,
      joinedAt: getRelativeTime(4),
      isOnline: true,
    },
  ],
  "3": [
    {
      id: "host3",
      name: "박파티장",
      avatar: "https://i.pravatar.cc/150?img=12",
      isHost: true,
      joinedAt: getRelativeTime(10),
      isOnline: true,
    },
    {
      id: "user1",
      name: "김철수",
      avatar: "https://i.pravatar.cc/150?img=1",
      isHost: false,
      joinedAt: getRelativeTime(8),
      isOnline: true,
    },
    {
      id: "user2",
      name: "이영희",
      avatar: "https://i.pravatar.cc/150?img=2",
      isHost: false,
      joinedAt: getRelativeTime(7),
      isOnline: true,
    },
    {
      id: "user3",
      name: "박민수",
      avatar: "https://i.pravatar.cc/150?img=3",
      isHost: false,
      joinedAt: getRelativeTime(6),
      isOnline: false,
    },
    {
      id: "user4",
      name: "정수진",
      avatar: "https://i.pravatar.cc/150?img=4",
      isHost: false,
      joinedAt: getRelativeTime(5),
      isOnline: true,
    },
    {
      id: "me",
      name: "나",
      avatar: "https://i.pravatar.cc/150?img=6",
      isHost: false,
      joinedAt: getRelativeTime(4),
      isOnline: true,
    },
  ],
};

// 파티원 목록 조회 함수
export const getPartyMembers = (partyId: string): PartyMember[] => {
  return mockPartyMembers[partyId] || [];
};

// 파티원 강퇴 함수 (목데이터용)
export const kickPartyMember = (
  partyId: string,
  memberId: string
): PartyMember[] => {
  const members = mockPartyMembers[partyId];
  if (members) {
    mockPartyMembers[partyId] = members.filter(
      (member) => member.id !== memberId
    );
    return mockPartyMembers[partyId];
  }
  return [];
};
