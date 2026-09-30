"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn, fromDateKey, toDateKey } from "@/lib/utils";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/**
 * 한 달씩 넘겨 보는 날짜 선택 달력.
 * - value/onChange는 "YYYY-MM-DD" 문자열
 * - min~max 밖의 날짜(지난 날짜 등)는 누를 수 없다
 * - 날짜 칸은 44px 이상으로 누르기 쉽게 둔다
 */
export function Calendar({
  value,
  onChange,
  min,
  max,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  min: Date;
  max: Date;
  className?: string;
}) {
  const minDay = startOfDay(min);
  const maxDay = startOfDay(max);
  const initial = value ? fromDateKey(value) : minDay;
  const [view, setView] = useState(() => new Date(initial.getFullYear(), initial.getMonth(), 1));

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = toDateKey(new Date());

  const canPrev = new Date(year, month, 1) > new Date(minDay.getFullYear(), minDay.getMonth(), 1);
  const canNext = new Date(year, month + 1, 1) <= maxDay;

  // 앞쪽 빈칸 + 날짜
  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  return (
    <div className={cn("rounded-2xl border-2 border-border p-2 sm:p-3", className)}>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="이전 달"
          disabled={!canPrev}
          onClick={() => setView(new Date(year, month - 1, 1))}
          className="flex size-11 items-center justify-center rounded-full hover:bg-muted disabled:opacity-30"
        >
          <ChevronLeft className="size-6" />
        </button>
        <p className="text-lg font-extrabold" aria-live="polite">
          {year}년 {month + 1}월
        </p>
        <button
          type="button"
          aria-label="다음 달"
          disabled={!canNext}
          onClick={() => setView(new Date(year, month + 1, 1))}
          className="flex size-11 items-center justify-center rounded-full hover:bg-muted disabled:opacity-30"
        >
          <ChevronRight className="size-6" />
        </button>
      </div>

      <div role="grid" aria-label={`${year}년 ${month + 1}월`} className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((w, i) => (
          <span
            key={w}
            role="columnheader"
            className={cn(
              "py-1 text-sm font-bold text-muted-foreground",
              i === 0 && "text-danger",
              i === 6 && "text-[#2563eb]",
            )}
          >
            {w}
          </span>
        ))}
        {cells.map((date, i) => {
          if (!date) return <span key={`blank-${i}`} />;
          const key = toDateKey(date);
          const disabled = date < minDay || date > maxDay;
          const selected = key === value;
          const weekday = date.getDay();
          return (
            <button
              key={key}
              type="button"
              role="gridcell"
              aria-selected={selected}
              aria-label={date.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" })}
              disabled={disabled}
              onClick={() => onChange(key)}
              // 버튼은 칸 너비 전체 × 높이 44px로 누르기 쉽게, 동그라미는 칸 너비에 맞춰 넘치지 않게 그린다
              className="group flex h-11 w-full items-center justify-center disabled:cursor-default"
            >
              <span
                className={cn(
                  "relative flex aspect-square w-[min(100%,2.5rem)] items-center justify-center rounded-full text-lg font-bold transition-colors",
                  !selected && !disabled && "group-hover:bg-primary-soft",
                  !selected && weekday === 0 && "text-danger",
                  !selected && weekday === 6 && "text-[#2563eb]",
                  selected && "bg-primary text-white",
                  disabled && "font-medium text-placeholder",
                )}
              >
                {date.getDate()}
                {/* 오늘 표시 */}
                {key === todayKey && !selected && (
                  <span aria-hidden className="absolute bottom-0.5 size-1.5 rounded-full bg-accent" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
