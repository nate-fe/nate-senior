"use client";

import { Check, ChevronLeft, ChevronRight, Clock, Handshake, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cardClass } from "@/components/ui/card";
import { DELIVERY_FORMATS, EXPERIENCE_CATEGORIES } from "@/entities/haebom";
import { track } from "@/features/analytics/track";
import { ReviewItem } from "@/features/haebom/review-item";
import { CategoryBadge, Rating, ageGroup, formatPrice, maskName } from "@/features/haebom/ui";
import { useExperience } from "@/lib/haebom-queries";
import { cn } from "@/lib/utils";

// 상세 화면에 미리 보여 줄 후기 수. 이보다 많으면 "모두 보기" 버튼이 생긴다.
const REVIEW_PREVIEW_COUNT = 5;

export default function ExperienceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: e, isPending, isError, error } = useExperience(id);

  useEffect(() => {
    track("haebom_experience_viewed", { experienceId: id });
  }, [id]);

  if (isPending) return <p className="mx-auto max-w-3xl px-4 py-10 text-lg text-muted-foreground">불러오는 중…</p>;
  if (isError) return <p className="mx-auto max-w-3xl px-4 py-10 text-lg text-danger">{error.message}</p>;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pt-6 pb-32 md:px-6">
      <Link
        href="/haebom/experiences"
        className="flex h-11 w-fit items-center gap-1 text-lg font-bold text-muted-foreground"
      >
        <ChevronLeft className="size-6" /> 경험 목록
      </Link>

      {/* 상품 */}
      <section className={cn(cardClass, "flex flex-col gap-4 p-6 md:p-8")}>
        <p className="text-base font-bold text-accent">{EXPERIENCE_CATEGORIES[e.category].label}</p>
        <h1 className="text-3xl leading-snug font-extrabold tracking-[-0.04em]">{e.title}</h1>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-lg">
          <Rating rating={e.rating} count={e.reviewCount} />
          <span className="flex items-center gap-1 text-muted-foreground">
            <Handshake className="size-5" /> {e.deals}번 거래
          </span>
        </div>
        <dl className="grid grid-cols-3 gap-2 text-center">
          <Fact icon={<Handshake className="size-7" />} label="방식" value={DELIVERY_FORMATS[e.format]} />
          <Fact icon={<Clock className="size-7" />} label="시간" value={e.duration} />
          <Fact icon={<MapPin className="size-7" />} label="지역" value={e.area} />
        </dl>
      </section>

      {/* 해 드리는 것 */}
      <section className={cn(cardClass, "p-6 md:p-8")}>
        <h2 className="text-xl font-extrabold">이렇게 도와드려요</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {e.includes.map((item) => (
            <li key={item} className="flex items-start gap-3 text-lg">
              <Check className="mt-1 size-6 shrink-0 stroke-[3] text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* 판매자: 경력보다 실제로 해본 경험 */}
      <section className={cn(cardClass, "p-6 md:p-8")}>
        <h2 className="text-xl font-extrabold">해본 분</h2>
        <div className="mt-4 flex items-center gap-4">
          {/* 구매자 화면에서는 "누가"보다 "무엇을"이 먼저라 얼굴 대신 경험 분야 아이콘을 둔다 */}
          <CategoryBadge category={e.category} />
          <div>
            <p className="text-xl font-extrabold">
              {maskName(e.seller.name)} <span className="text-lg font-bold text-muted-foreground">{ageGroup(e.seller.age)}</span>
            </p>
            <p className="text-lg font-semibold text-primary-strong">{e.seller.background}</p>
          </div>
        </div>
        <p className="mt-4 rounded-2xl bg-accent-soft p-5 text-lg leading-relaxed">“{e.seller.story}”</p>
      </section>

      {/* 후기: 최신 5개까지만 보여 주고, 더 있으면 전체 후기 화면으로 */}
      {e.reviews.length > 0 && (
        <section className={cn(cardClass, "p-6 md:p-8")}>
          <h2 className="flex items-baseline gap-2 text-xl font-extrabold">
            이용 후기 <span className="text-lg text-primary">{e.reviewCount}</span>
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {e.reviews.slice(0, REVIEW_PREVIEW_COUNT).map((r) => (
              <ReviewItem key={r.id} review={r} />
            ))}
          </ul>
          {e.reviews.length > REVIEW_PREVIEW_COUNT && (
            <Link
              href={`/haebom/experiences/${e.id}/reviews`}
              className={cn(buttonVariants({ variant: "outline" }), "mt-4 w-full")}
            >
              후기 {e.reviewCount}개 모두 보기 <ChevronRight />
            </Link>
          )}
        </section>
      )}

      {/* 하단 고정: 가격 + 신청 */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <p className="shrink-0">
            <span className="block text-base text-muted-foreground">{e.duration}</span>
            <span className="text-2xl font-extrabold">{formatPrice(e.price)}</span>
          </p>
          <Link href={`/haebom/experiences/${e.id}/request`} className={cn(buttonVariants({ size: "lg" }), "flex-1 text-xl")}>
            신청하기
          </Link>
        </div>
      </div>
    </div>
  );
}

function Fact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-background px-2 py-4">
      <span className="text-accent">{icon}</span>
      <dt className="text-base text-muted-foreground">{label}</dt>
      <dd className="text-lg font-bold">{value}</dd>
    </div>
  );
}
