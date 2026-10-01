"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Material 3 내비게이션 드로어(목차). 지금 화면에 보이는 장을 알약 모양 활성 표시로 강조한다.
export function NavigationDrawer({ sections }: { sections: readonly { id: string; title: string }[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    // 화면 위에서 30% 지점을 이미 지나간 장 중 마지막 장을 "지금 보고 있는 장"으로 본다
    const update = () => {
      const line = window.innerHeight * 0.3;
      let current = sections[0]?.id ?? "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) current = s.id;
      }
      // 맨 아래까지 내렸으면 마지막 장
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1]?.id ?? current;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  return (
    <aside className="sticky top-0 hidden h-screen w-[300px] shrink-0 flex-col bg-md-surface-container-low px-3 py-8 xl:flex">
      <p className="md-title-medium px-4 text-md-on-surface-variant">Senior Platform</p>
      <p className="md-title-large px-4 pt-1 pb-6 text-md-on-surface">UI 브리핑</p>
      <nav aria-label="목차" className="flex flex-col gap-1">
        {sections.map((s, i) => {
          const selected = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={selected ? "true" : undefined}
              className={cn(
                "md-label-large flex h-14 items-center gap-3 rounded-full px-4 transition-colors",
                selected
                  ? "bg-md-secondary-container text-md-on-secondary-container"
                  : "text-md-on-surface-variant hover:bg-md-on-surface/8",
              )}
            >
              <span className="w-5 tabular-nums">{i + 1}</span>
              {s.title}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
