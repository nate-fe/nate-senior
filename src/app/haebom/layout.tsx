import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "해봄 · 해본 분의 경험을 사세요",
  description: "중고차 고르기, 계약서 확인, 재취업까지. 직접 해본 분이 옆에서 도와드립니다.",
};

export default function HaebomLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-haebom flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-6 px-4 md:px-6">
          <HaebomLogo />
          <nav className="ml-auto flex items-center gap-1">
            <Link
              href="/haebom/experiences"
              className="flex h-11 items-center rounded-full px-4 text-base font-bold text-subtle-foreground hover:bg-muted"
            >
              경험 둘러보기
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-8 text-center text-base text-muted-foreground">
        해봄 · 네이트 시니어 · PoC 데모 화면입니다
      </footer>
    </div>
  );
}

function HaebomLogo() {
  return (
    <Link href="/haebom" className="flex items-center gap-2 text-xl font-extrabold tracking-[-0.03em] text-primary-strong">
      {/* 떠오르는 해 모양 마크 */}
      <span aria-hidden className="relative block h-5 w-7 overflow-hidden">
        <span className="absolute bottom-0 left-0 size-7 translate-y-1/2 rounded-full bg-sun" />
      </span>
      해봄
    </Link>
  );
}
