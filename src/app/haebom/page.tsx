import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EXPERIENCE_CATEGORIES, type ExperienceCategory } from "@/entities/haebom";
import { CATEGORY_ICON } from "@/features/haebom/ui";
import { cn } from "@/lib/utils";
import { FeaturedExperiences } from "./featured-experiences";

const STEPS = [
  { no: "1", title: "경험 고르기", body: "필요한 일을 해본 분과 그 경험을 고릅니다." },
  { no: "2", title: "신청하기", body: "원하는 날짜와 부탁할 내용을 적어 신청합니다." },
  { no: "3", title: "해본 분이 연락", body: "해본 분이 확인하고 먼저 연락드려 약속을 잡습니다." },
];

export default function HaebomHome() {
  const categories = Object.entries(EXPERIENCE_CATEGORIES) as [
    ExperienceCategory,
    (typeof EXPERIENCE_CATEGORIES)[ExperienceCategory],
  ][];

  return (
    <>
      {/* 히어로: 구매자 대상 */}
      <section className="relative overflow-hidden bg-linear-to-b from-accent-soft to-background">
        <div aria-hidden className="absolute -top-40 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-sun/40 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 pt-16 pb-20 text-center md:px-6 md:pt-24">
          <p className="inline-flex items-center rounded-full bg-surface px-4 py-2 text-base font-bold text-primary-strong shadow-sm">
            경험 마켓플레이스 해봄
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl leading-tight font-extrabold tracking-[-0.045em] md:text-6xl">
            해본 분이
            <br />
            <span className="text-primary">옆에서 도와드려요</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-subtle-foreground">
            중고차 고르기, 전·월세 계약, 퇴직 후 재취업까지. 직접 해본 시니어의 경험을 필요한 만큼 사세요.
          </p>
          <Link href="/haebom/experiences" className={cn(buttonVariants({ size: "lg" }), "mt-10 px-10 text-xl")}>
            경험 둘러보기 <ArrowRight />
          </Link>
        </div>
      </section>

      {/* 분야 */}
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <h2 className="text-3xl font-extrabold tracking-[-0.04em]">어떤 도움이 필요하세요?</h2>
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {categories.map(([key, c]) => {
            const Icon = CATEGORY_ICON[key];
            return (
              <li key={key}>
                <Link
                  href={`/haebom/experiences?category=${key}`}
                  className="flex h-full flex-col gap-3 rounded-3xl bg-surface p-5 shadow-[0_12px_32px_-16px_rgba(22,36,27,0.15)] transition-transform hover:-translate-y-0.5 md:p-6"
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <Icon className="size-8" />
                  </span>
                  <span className="text-xl font-extrabold">{c.label}</span>
                  <span className="text-base text-muted-foreground">{c.example}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 인기 경험 */}
      <section className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
        <h2 className="text-3xl font-extrabold tracking-[-0.04em]">많이 찾는 경험</h2>
        <FeaturedExperiences />
      </section>

      {/* 이용 방법 */}
      <section className="bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
          <h2 className="text-3xl font-extrabold tracking-[-0.04em]">이렇게 이용해요</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.no} className="rounded-3xl bg-background p-6">
                <span className="flex size-12 items-center justify-center rounded-full bg-sun text-xl font-extrabold text-ink">
                  {s.no}
                </span>
                <h3 className="mt-5 text-xl font-extrabold">{s.title}</h3>
                <p className="mt-2 text-lg leading-relaxed text-subtle-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 판매자(시니어) 대상: 기획서 모토 */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center md:px-6">
          <p className="text-lg font-bold text-accent-on-dark">해본 일이 있다면</p>
          <h2 className="mt-3 text-3xl leading-snug font-extrabold tracking-[-0.04em] md:text-4xl">
            경험이 돈이 되고,
            <br />
            다시 경력이 됩니다
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/75">
            오래 해 온 일, 몸으로 익힌 요령은 누군가에게 꼭 필요한 경험입니다. 해봄에서 그 경험을 파세요.
          </p>
        </div>
      </section>
    </>
  );
}
