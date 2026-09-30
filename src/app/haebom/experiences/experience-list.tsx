"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { EXPERIENCE_CATEGORIES, type ExperienceCategory, experienceCategorySchema } from "@/entities/haebom";
import { ExperienceCard } from "@/features/haebom/experience-card";
import { useExperiences } from "@/lib/haebom-queries";
import { cn } from "@/lib/utils";

export function ExperienceList() {
  const router = useRouter();
  const param = useSearchParams().get("category");
  const category = experienceCategorySchema.safeParse(param).success ? (param as ExperienceCategory) : undefined;
  const { data: experiences, isPending } = useExperiences(category);

  const choose = (next?: ExperienceCategory) =>
    router.replace(next ? `/haebom/experiences?category=${next}` : "/haebom/experiences", { scroll: false });

  const chips: [ExperienceCategory | undefined, string][] = [
    [undefined, "전체"],
    ...(Object.entries(EXPERIENCE_CATEGORIES) as [ExperienceCategory, { label: string }][]).map(
      ([k, v]) => [k, v.label] as [ExperienceCategory, string],
    ),
  ];

  return (
    <>
      {/* 분야 고르기: 큰 알약 버튼, 줄바꿈으로 가로 스크롤 없음 */}
      <div role="radiogroup" aria-label="분야" className="flex flex-wrap gap-2">
        {chips.map(([key, label]) => {
          const selected = key === category;
          return (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => choose(key)}
              className={cn(
                "h-12 rounded-full border-2 px-5 text-lg font-bold transition-colors",
                selected
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface text-subtle-foreground hover:bg-muted",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {isPending ? (
        <p className="mt-8 text-lg text-muted-foreground">불러오는 중…</p>
      ) : experiences?.length === 0 ? (
        <p className="mt-8 text-lg text-muted-foreground">이 분야에는 아직 경험 상품이 없어요.</p>
      ) : (
        <ul className="mt-6 grid gap-3 md:grid-cols-2 md:gap-4">
          {experiences?.map((e) => (
            <li key={e.id}>
              <ExperienceCard experience={e} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
