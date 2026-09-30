"use client";

import { ChevronLeft, Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cardClass } from "@/components/ui/card";
import { ReviewItem } from "@/features/haebom/review-item";
import { useExperience } from "@/lib/haebom-queries";
import { cn } from "@/lib/utils";

// 경험 상품의 이용 후기 전체
export default function ExperienceReviewsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: e, isPending, isError, error } = useExperience(id);

  if (isPending) return <p className="mx-auto max-w-3xl px-4 py-10 text-lg text-muted-foreground">불러오는 중…</p>;
  if (isError) return <p className="mx-auto max-w-3xl px-4 py-10 text-lg text-danger">{error.message}</p>;

  // 별점별 개수 (5점 → 1점)
  const distribution = [5, 4, 3, 2, 1].map((score) => ({
    score,
    count: e.reviews.filter((r) => r.rating === score).length,
  }));

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pt-6 pb-16 md:px-6">
      <Link
        href={`/haebom/experiences/${e.id}`}
        className="flex h-11 w-fit items-center gap-1 text-lg font-bold text-muted-foreground"
      >
        <ChevronLeft className="size-6" /> 경험 소개
      </Link>

      <div>
        <p className="text-base font-bold text-muted-foreground">{e.title}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.04em]">
          이용 후기 <span className="text-primary">{e.reviewCount}</span>
        </h1>
      </div>

      {/* 평점 요약 */}
      <section className={cn(cardClass, "flex items-center gap-6 p-6 md:p-7")}>
        <div className="text-center">
          <p className="text-5xl font-extrabold tracking-[-0.04em]">{e.rating.toFixed(1)}</p>
          <p className="mt-1 flex items-center justify-center gap-1 text-base text-muted-foreground">
            <Star className="size-4 fill-sun text-sun" /> 평균 별점
          </p>
        </div>
        <ul className="flex flex-1 flex-col gap-1.5">
          {distribution.map(({ score, count }) => (
            <li key={score} className="grid grid-cols-[2.5rem_1fr_2rem] items-center gap-2 text-base">
              <span className="text-muted-foreground">{score}점</span>
              <span className="h-2.5 overflow-hidden rounded-full bg-muted-strong">
                <span
                  className="block h-full rounded-full bg-sun"
                  style={{ width: `${e.reviewCount ? (count / e.reviewCount) * 100 : 0}%` }}
                />
              </span>
              <span className="text-right text-muted-foreground tabular-nums">{count}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 전체 후기 (최신순) */}
      <ul className={cn(cardClass, "flex flex-col gap-3 p-4 md:p-6")}>
        {e.reviews.map((r) => (
          <ReviewItem key={r.id} review={r} />
        ))}
      </ul>
    </div>
  );
}
