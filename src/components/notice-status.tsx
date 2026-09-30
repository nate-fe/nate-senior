import type { Output } from "@/entities";
import { cn } from "@/lib/utils";

// 보호자 알림장 상태: 보내기 전 → 확인 전(보냈지만 안 읽음) → 보호자 확인
// 세 상태 모두 배경 없이 같은 크기의 굵은 글씨로, 색만 다르게 보여 준다.
const STATUS = {
  unsent: { label: "보내기 전", className: "text-accent" },
  unread: { label: "확인 전", className: "text-pending" },
  read: { label: "보호자 확인", className: "text-success" },
} as const;

export function NoticeStatus({ notice }: { notice?: Output }) {
  if (!notice) return null;
  const key = notice.status !== "sent" ? "unsent" : notice.readAt ? "read" : "unread";
  const { label, className } = STATUS[key];
  return <span className={cn("text-lg font-extrabold whitespace-nowrap", className)}>{label}</span>;
}
