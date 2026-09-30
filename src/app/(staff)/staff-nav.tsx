"use client";

import { ClipboardList, House, NotebookPen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlan } from "@/features/plan-gate";
import { ROLES, useRole } from "@/features/session/role";
import { useInstitution } from "@/lib/queries";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "홈", icon: House },
  { href: "/records/new", label: "기록 입력", icon: NotebookPen },
] as const;

/**
 * 데스크톱: 짙은 나무색 사이드바.
 * 모바일: 얇은 상단 바(로고·사용자) + 큰 아이콘과 글씨의 하단 탭 바.
 * 50~70대 사용자에게 익숙한 메신저·은행 앱과 같은 배치다.
 */
export function StaffNav() {
  const pathname = usePathname();
  const { data: institution } = useInstitution();
  const { isPro } = usePlan();
  const { role, href: roleHref } = useRole();
  const reviewing = pathname.includes("/review");

  return (
    <>
      {/* 데스크톱 사이드바 */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-wood-dark px-4 py-7 text-wood-dark-foreground lg:flex">
        <Logo className="mb-10 px-3 text-xl" href={roleHref("/dashboard")} />
        <nav aria-label="주요 메뉴" className="flex flex-col gap-1.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={roleHref(href)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-14 items-center gap-3 rounded-2xl px-4 text-lg font-bold text-wood-dark-muted hover:bg-wood-dark-hover hover:text-white",
                  active && "bg-primary text-white hover:bg-primary",
                )}
              >
                <Icon className="size-6" />
                {label}
              </Link>
            );
          })}
          {reviewing && (
            <span className="flex h-14 items-center gap-3 rounded-2xl bg-primary px-4 text-lg font-bold text-white">
              <ClipboardList className="size-6" />
              문서 보내기
            </span>
          )}
        </nav>

        <div className="mt-auto flex flex-col gap-4 rounded-3xl bg-wood-dark-hover p-5">
          <div>
            <p className="text-lg font-extrabold text-white">{institution?.name ?? " "}</p>
            <p className="mt-1 flex items-center gap-2 text-wood-dark-muted">
              요금제
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-sm font-bold",
                  isPro ? "bg-accent-on-dark text-wood-dark" : "bg-white/10 text-wood-dark-foreground",
                )}
              >
                {isPro ? "PRO" : "FREE"}
              </span>
            </p>
          </div>
          <p className="border-t border-white/10 pt-4 text-lg font-bold text-white">
            <UserName role={role} />
          </p>
        </div>
      </aside>

      {/* 모바일 상단 바 */}
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 bg-wood-dark px-4 text-wood-dark-foreground lg:hidden">
        <Logo className="mr-auto text-lg" href={roleHref("/dashboard")} />
        <p className="truncate text-base font-bold text-white">
          <UserName role={role} />
        </p>
      </header>

      {/* 모바일 하단 탭 바 */}
      <nav
        aria-label="주요 메뉴"
        className="fixed inset-x-0 bottom-0 z-30 grid h-[4.5rem] grid-cols-2 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href) || (href === "/dashboard" && reviewing);
          return (
            <Link
              key={href}
              href={roleHref(href)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 text-base font-bold text-muted-foreground",
                active && "text-primary",
              )}
            >
              <Icon className={cn("size-7", active && "stroke-[2.5]")} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function Logo({ className, href }: { className?: string; href: string }) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2 font-extrabold tracking-[-0.03em] whitespace-nowrap text-white", className)}
    >
      <span aria-hidden className="size-3 rounded-[4px] bg-accent-on-dark" />
      시니어노트
    </Link>
  );
}

// 예) "김영숙 요양보호사님"
function UserName({ role }: { role: keyof typeof ROLES }) {
  const { name, title } = ROLES[role];
  return (
    <>
      {name} <span className="font-semibold text-wood-dark-muted">{title}님</span>
    </>
  );
}
