import dayjs, { Dayjs } from "dayjs";

export function getTimeOptions(
  selectedDate: Dayjs,
  openTime: string,
  closeTime: string
) {
  const result: string[] = [];

  // 시간 문자열에서 시와 분 추출 (HH:MM 또는 HH:MM:SS 형식 지원)
  const parseTime = (timeStr: string) => {
    const parts = timeStr.split(":");
    return {
      hour: Number(parts[0]),
      minute: Number(parts[1]),
    };
  };

  const openTimeParts = parseTime(openTime);
  const closeTimeParts = parseTime(closeTime);

  let t = dayjs(selectedDate)
    .hour(openTimeParts.hour)
    .minute(openTimeParts.minute);
  const end = dayjs(selectedDate)
    .hour(closeTimeParts.hour)
    .minute(closeTimeParts.minute);
  while (t.isBefore(end)) {
    result.push(t.format("HH:mm"));
    t = t.add(30, "minute");
  }
  return result;
}

// 네이버 예약 스타일의 시간 그리드 생성을 위한 함수
export function getTimeGridOptions(
  selectedDate: Dayjs,
  openTime: string,
  closeTime: string
) {
  const timeSlots: Array<{
    time: string;
    available: boolean;
    isPast: boolean;
  }> = [];

  // 시간 문자열에서 시와 분 추출 (HH:MM 또는 HH:MM:SS 형식 지원)
  const parseTime = (timeStr: string) => {
    const parts = timeStr.split(":");
    return {
      hour: Number(parts[0]),
      minute: Number(parts[1]),
    };
  };

  const openTimeParts = parseTime(openTime);
  const closeTimeParts = parseTime(closeTime);

  // 영업 시작 시간을 30분 단위로 맞춤
  let currentTime = dayjs(selectedDate)
    .hour(openTimeParts.hour)
    .minute(openTimeParts.minute);

  // 30분 단위로 맞추기
  const minutes = currentTime.minute();
  if (minutes > 0 && minutes < 30) {
    currentTime = currentTime.minute(30);
  } else if (minutes > 30) {
    currentTime = currentTime.add(1, "hour").minute(0);
  }

  const endTime = dayjs(selectedDate)
    .hour(closeTimeParts.hour)
    .minute(closeTimeParts.minute);

  const now = dayjs();

  while (currentTime.isBefore(endTime)) {
    const timeString = currentTime.format("HH:mm");
    const isPastTime =
      selectedDate.isSame(now, "date") && currentTime.isBefore(now);

    timeSlots.push({
      time: timeString,
      available: !isPastTime,
      isPast: isPastTime,
    });

    currentTime = currentTime.add(30, "minute");
  }

  return timeSlots;
}

// 시간을 그룹으로 나누는 함수 (네이버 예약 스타일)
export function groupTimeSlots(
  timeSlots: Array<{ time: string; available: boolean; isPast: boolean }>
) {
  const groups: Array<{
    hour: string;
    slots: Array<{ time: string; available: boolean; isPast: boolean }>;
  }> = [];

  timeSlots.forEach((slot) => {
    const hour = slot.time.split(":")[0];
    const existingGroup = groups.find((group) => group.hour === hour);

    if (existingGroup) {
      existingGroup.slots.push(slot);
    } else {
      groups.push({
        hour,
        slots: [slot],
      });
    }
  });

  return groups;
}

export function isPast(date: Dayjs, time?: string) {
  if (!date) return false;
  const now = dayjs();
  if (date.isBefore(now, "date")) return true;
  if (date.isSame(now, "date") && time) {
    const [h, m] = time.split(":").map(Number);
    if (h < now.hour() || (h === now.hour() && m <= now.minute())) return true;
  }
  return false;
}

// 시간 포맷팅 함수 (오전/오후 표시)
export function formatTimeDisplay(time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour < 12 ? "오전" : "오후";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${period} ${displayHour}:${minute.toString().padStart(2, "0")}`;
}
