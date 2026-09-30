import { type ReactNode, Suspense } from "react";
import { StaffNav } from "./staff-nav";

// 사용자 구분(?role=)을 주소에서 읽기 때문에 내비게이션과 페이지를 Suspense로 감싼다.
// (정적으로 미리 만드는 페이지에서 useSearchParams를 쓰려면 Suspense 경계가 필요하다)
export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col lg:flex-row">
      <Suspense fallback={<div className="h-16 bg-wood-dark lg:h-screen lg:w-64" />}>
        <StaffNav />
      </Suspense>
      {/* 모바일에서는 하단 탭 바(4.5rem)에 가리지 않도록 아래 여백을 둔다 */}
      <main className="w-full min-w-0 flex-1 px-4 pt-6 pb-28 md:px-8 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <Suspense>{children}</Suspense>
        </div>
      </main>
    </div>
  );
}
