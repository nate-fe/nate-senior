import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "시니어노트 · 요양기관 기록 관리",
  description: "요양보호사 기록 한 번으로 보호자 알림장부터 공단 제출 문서까지.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
