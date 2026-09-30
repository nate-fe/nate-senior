import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// 9월 28일
export function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

// 오후 2:00
export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" });
}

// 날짜만 다루는 "YYYY-MM-DD" 값. 시간대 때문에 하루가 밀리지 않도록 로컬 날짜로 만든다.
export function toDateKey(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export function fromDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// "2026-10-04" → "10월 4일 (일)"
export function formatDateKey(key: string) {
  return fromDateKey(key).toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
}
