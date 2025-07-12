import dayjs, { Dayjs } from "dayjs";

export function getTimeOptions(
  selectedDate: Dayjs,
  openTime: string,
  closeTime: string
) {
  const result: string[] = [];
  let t = dayjs(selectedDate)
    .hour(Number(openTime.split(":")[0]))
    .minute(Number(openTime.split(":")[1]));
  const end = dayjs(selectedDate)
    .hour(Number(closeTime.split(":")[0]))
    .minute(Number(closeTime.split(":")[1]));
  while (t.isBefore(end)) {
    result.push(t.format("HH:mm"));
    t = t.add(30, "minute");
  }
  return result;
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
