import Link from "next/link";
import { cardClass } from "@/components/ui/card";
import { DELIVERY_FORMATS, EXPERIENCE_CATEGORIES } from "@/entities/haebom";
import { Rating, ageGroup, formatPrice, maskName } from "@/features/haebom/ui";
import type { ExperienceSummary } from "@/lib/haebom-api";
import { cn } from "@/lib/utils";

// 경험 상품 카드: 무엇을 해 주는지(제목)가 먼저, 누가 해 봤는지(판매자)가 다음이다.
export function ExperienceCard({ experience: e }: { experience: ExperienceSummary }) {
  return (
    <Link href={`/haebom/experiences/${e.id}`} className={cn(cardClass, "flex h-full flex-col gap-3 p-5 md:p-6")}>
      <span className="flex flex-wrap items-center gap-2 text-base font-bold">
        <span className="text-accent">{EXPERIENCE_CATEGORIES[e.category].label}</span>
        <span className="text-muted-foreground">
          · {DELIVERY_FORMATS[e.format]} {e.duration}
        </span>
      </span>
      <span className="text-xl leading-snug font-extrabold">{e.title}</span>
      <span className="text-lg text-primary-strong">
        <span className="font-bold">
          {maskName(e.seller.name)} ({ageGroup(e.seller.age)})
        </span>{" "}
        · {e.seller.background}
      </span>
      <span className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-2">
        <span className="flex items-center gap-3 text-base">
          <Rating rating={e.rating} count={e.reviewCount} />
          <span className="text-muted-foreground">{e.deals}번 거래</span>
        </span>
        <span className="text-xl font-extrabold">{formatPrice(e.price)}</span>
      </span>
    </Link>
  );
}
