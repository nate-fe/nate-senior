import { Briefcase, Car, ChefHat, House, Star } from "lucide-react";
import Image from "next/image";
import type { ExperienceCategory } from "@/entities/haebom";
import { cn } from "@/lib/utils";

export const CATEGORY_ICON: Record<ExperienceCategory, typeof Car> = {
  car: Car,
  home: House,
  life: ChefHat,
  career: Briefcase,
};

// 경험 분야 아이콘 동그라미(구매자 화면에서 판매자 얼굴 자리 대신)
export function CategoryBadge({ category, className }: { category: ExperienceCategory; className?: string }) {
  const Icon = CATEGORY_ICON[category];
  return (
    <span
      aria-hidden
      className={cn("flex size-16 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent", className)}
    >
      <Icon className="size-8" />
    </span>
  );
}

// 판매자 얼굴 자리: 프로필 사진이 있으면 사진, 없으면 성(姓) 한 글자
export function SellerAvatar({ name, photo, className }: { name: string; photo?: string; className?: string }) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={`${name} 님 프로필 사진`}
        width={128}
        height={128}
        // 화면 위쪽의 작은 사진이라 바로 불러온다(Next 16: priority 대신 loading="eager")
        loading="eager"
        className={cn("size-16 shrink-0 rounded-full object-cover", className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-16 shrink-0 items-center justify-center rounded-full bg-primary-soft text-2xl font-extrabold text-primary-strong",
        className,
      )}
    >
      {name.slice(0, 1)}
    </span>
  );
}

export function Rating({ rating, count }: { rating: number; count: number }) {
  return (
    <span className="inline-flex items-center gap-1 font-bold">
      <Star className="size-5 fill-sun text-sun" />
      {rating.toFixed(1)}
      <span className="font-medium text-muted-foreground">({count})</span>
    </span>
  );
}

// 70000 → "7만원", 15000 → "1만 5천원"
export function formatPrice(won: number) {
  const man = Math.floor(won / 10000);
  const chun = Math.floor((won % 10000) / 1000);
  return `${man ? `${man}만` : ""}${man && chun ? " " : ""}${chun ? `${chun}천` : ""}원`;
}

// 구매자에게 보이는 판매자 표기. 실명과 정확한 나이는 드러내지 않는다.
// "김정비" → "김○○"
export function maskName(name: string) {
  return `${name.slice(0, 1)}${"○".repeat(Math.max(name.length - 1, 1))}`;
}

// 66 → "60대"
export function ageGroup(age: number) {
  return `${Math.floor(age / 10) * 10}대`;
}
