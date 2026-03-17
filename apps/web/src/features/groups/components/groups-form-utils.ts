import type { WeekDay } from "../types";

export const WEEK_DAY_LABEL: Record<WeekDay, string> = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};

export function formatMinute(minute: number) {
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function minuteToTimeInputValue(minute: number) {
  const normalized = Number.isFinite(minute) ? Math.max(0, Math.min(1439, minute)) : 0;
  return formatMinute(normalized);
}

export function timeInputValueToMinute(value: string) {
  if (!value || !value.includes(":")) return null;
  const [h, m] = value.split(":").map(Number);
  if (!Number.isInteger(h) || !Number.isInteger(m)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}
