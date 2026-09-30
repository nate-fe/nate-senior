import { Suspense } from "react";
import { ExperienceList } from "./experience-list";

// 분야(?category=)를 주소에서 읽으므로 Suspense로 감싼다.
export default function ExperiencesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      {/* 제목은 화면에 보이지 않게 두고, 화면낭독기용으로만 남긴다 */}
      <h1 className="sr-only">경험 둘러보기</h1>
      <Suspense>
        <ExperienceList />
      </Suspense>
    </div>
  );
}
