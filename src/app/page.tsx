import { ArrowRight, Camera, Check, CheckCheck, MessageCircle, Mic } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { OUTPUT_META, OUTPUT_TYPES } from "@/entities";
import { cn } from "@/lib/utils";
import { InquiryForm } from "./inquiry-form";
import { TrackedLink } from "./tracked-link";

export const metadata: Metadata = {
  title: "네이트 시니어 · 요양기관 기록 도구",
  description: "요양보호사 기록 한 번으로 보호자 알림장부터 공단 제출 문서까지.",
};

// 랜딩 전용 알약형 CTA. 오렌지 바탕 흰 글씨는 큰 굵은 글씨일 때만 대비 기준을 넘으므로 lg + bold로 고정한다.
const cta = (variant: "default" | "outline" = "default") =>
  cn(buttonVariants({ size: "lg", variant }), "rounded-full px-7 font-bold");

const STEPS = [
  { no: "1", title: "현장에서 짧게 기록", body: "요양보호사가 휴대폰으로 말하거나 몇 줄 적고, 사진을 붙입니다." },
  { no: "2", title: "문서 4종 초안 생성", body: "받는 사람에 맞춰 알림장, 상담기록, 월간보고서, 공단 문서 초안이 만들어집니다." },
  { no: "3", title: "확인하고 바로 전송", body: "초안을 보고 필요하면 고친 뒤, 버튼 한 번으로 보호자에게 보냅니다." },
];

const FREE_FEATURES = ["보호자 알림장 작성", "보호자 초대 · 답글", "사진 · 활동 공유"];
const PRO_FEATURES = [
  "Free의 모든 기능",
  "상담 · 활동 기록 자동 작성",
  "월간 활동보고서",
  "공단 제출 문서 초안",
  "기록 검색 · 기관별 템플릿",
  "업무관리 · 운영 통계",
];

export default function LandingPage() {
  return (
    <div className="theme-landing flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 md:px-6">
          <span className="flex items-center gap-2 text-lg font-extrabold tracking-tight whitespace-nowrap">
            <span aria-hidden className="size-3 rounded-[4px] bg-primary" />
            네이트 시니어
          </span>
          <nav className="hidden gap-7 text-[15px] font-medium text-subtle-foreground md:flex">
            <a href="#features" className="hover:text-foreground">
              서비스 소개
            </a>
            <a href="#pricing" className="hover:text-foreground">
              요금제
            </a>
            <a href="#inquiry" className="hover:text-foreground">
              도입 문의
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* 히어로 */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(60%_60%_at_50%_0%,#fde3d3_0%,rgba(253,227,211,0)_70%)]"
          />
          <div className="relative mx-auto max-w-6xl px-4 pt-16 text-center md:px-6 md:pt-24">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold text-subtle-foreground shadow-sm">
              <span aria-hidden className="size-1.5 rounded-full bg-primary" />
              <span className="hidden sm:inline">요양원 · 주간보호 · 재가요양 기관을 위한 기록 도구</span>
              <span className="sm:hidden">요양기관을 위한 기록 도구</span>
            </p>
            <h1 className="mx-auto mt-6 max-w-3xl text-[2.6rem] leading-[1.15] font-extrabold tracking-[-0.045em] md:text-7xl">
              기록은 한 번,
              <br />
              서류는 <span className="text-primary">네 가지</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-subtle-foreground md:text-xl">
              요양보호사의 짧은 기록으로 보호자 알림장부터 공단 제출 문서까지 초안을 만듭니다. 담당자가 확인한
              문서만 나가니 안심하고 쓸 수 있습니다.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <TrackedLink href="#inquiry" event="landing_cta_clicked" props={{ cta: "hero_inquiry" }} className={cta()}>
                무료로 시작하기
              </TrackedLink>
              <TrackedLink
                href="/records/new"
                event="landing_cta_clicked"
                props={{ cta: "hero_demo" }}
                className={cta("outline")}
              >
                데모 보기 <ArrowRight />
              </TrackedLink>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Free 요금제로 바로 시작 · 별도 설치 없이 웹과 모바일에서</p>

            <ProductWindow />
          </div>
        </section>

        {/* 벤토 그리드 */}
        <section id="features" className="scroll-mt-16 bg-background">
          <div className="mx-auto max-w-6xl px-4 py-24 md:px-6">
            <p className="font-bold text-accent">서비스 소개</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] md:text-5xl">
              현장은 가볍게,
              <br className="md:hidden" /> 서류는 정확하게
            </h2>

            <div className="mt-12 grid gap-4 md:grid-cols-6">
              <BentoCard className="md:col-span-4">
                <h3 className="text-2xl font-bold">기록 1건이 문서 4종으로</h3>
                <p className="mt-2 text-subtle-foreground">받는 사람에 맞는 말투와 형식으로 다시 씁니다.</p>
                <ul className="mt-6 divide-y divide-border rounded-2xl border border-border">
                  {OUTPUT_TYPES.map((t) => {
                    const m = OUTPUT_META[t];
                    return (
                      <li key={t} className="flex items-center gap-3 px-5 py-4">
                        <span className="flex-1 font-semibold">{m.label}</span>
                        <span className="text-sm text-muted-foreground">{m.audience}</span>
                        <span
                          className={cn(
                            "w-12 rounded-full py-0.5 text-center text-xs font-bold",
                            m.plan === "pro" ? "bg-ink text-white" : "bg-primary-soft text-accent",
                          )}
                        >
                          {m.plan === "pro" ? "PRO" : "FREE"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </BentoCard>

              <BentoCard className="flex flex-col bg-ink text-white md:col-span-2">
                <CheckCheck className="size-9 text-accent-on-dark" />
                <h3 className="mt-6 text-2xl font-bold">보호자가 읽었는지 바로 보여요</h3>
                <p className="mt-2 text-white/70">
                  보낸 알림장을 보호자가 확인하면 요양보호사 화면에 바로 표시됩니다.
                </p>
                <div className="mt-auto pt-8">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold whitespace-nowrap">
                    <Check className="size-4 text-accent-on-dark" /> 보호자 확인
                  </span>
                </div>
              </BentoCard>

              <BentoCard className="bg-primary-soft md:col-span-2">
                <div className="flex gap-2">
                  <IconChip>
                    <Mic />
                  </IconChip>
                  <IconChip>
                    <Camera />
                  </IconChip>
                </div>
                <h3 className="mt-6 text-2xl font-bold">말로, 사진으로</h3>
                <p className="mt-2 text-subtle-foreground">타이핑이 어려운 현장에서도 음성과 사진으로 바로 남깁니다.</p>
              </BentoCard>

              <BentoCard className="md:col-span-2">
                <IconChip>
                  <MessageCircle />
                </IconChip>
                <h3 className="mt-6 text-2xl font-bold">보호자와 바로 연결</h3>
                <p className="mt-2 text-subtle-foreground">
                  알림장을 받은 보호자가 답글로 기관에 마음을 전할 수 있습니다.
                </p>
              </BentoCard>

              <BentoCard className="md:col-span-2">
                <p className="text-6xl font-extrabold tracking-[-0.05em] text-primary">0원</p>
                <h3 className="mt-6 text-2xl font-bold">무료로 시작</h3>
                <p className="mt-2 text-subtle-foreground">
                  알림장은 Free로 쓰고, 서류까지 줄이고 싶을 때 Pro로 바꾸면 됩니다.
                </p>
              </BentoCard>
            </div>
          </div>
        </section>

        {/* 사용 흐름 */}
        <section className="mx-auto max-w-6xl px-4 py-24 md:px-6">
          <p className="font-bold text-accent">사용 방법</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] md:text-5xl">세 단계면 끝</h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.no} className="rounded-3xl border border-border p-7">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-white">
                  {s.no}
                </span>
                <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-subtle-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 요금제 */}
        <section id="pricing" className="scroll-mt-16 bg-background">
          <div className="mx-auto max-w-5xl px-4 py-24 md:px-6">
            <div className="text-center">
              <p className="font-bold text-accent">요금제</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] md:text-5xl">필요한 만큼만</h2>
              <p className="mt-4 text-lg text-subtle-foreground">
                무료로 시작하고, 쌓인 기록으로 서류 업무까지 줄이고 싶을 때 Pro로 바꾸세요.
              </p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              <PlanCard name="Free" price="0원" caption="알림장으로 보호자와 소통" features={FREE_FEATURES} action="무료로 시작하기" />
              <PlanCard
                name="Pro"
                price="도입 문의"
                caption="서류 업무까지 한 번에"
                features={PRO_FEATURES}
                action="Pro 상담 신청"
                highlighted
              />
            </div>
          </div>
        </section>

        {/* 도입 문의 */}
        <section id="inquiry" className="scroll-mt-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-24 md:px-6 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="font-bold text-accent">도입 문의</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] md:text-5xl">
                우리 기관에
                <br />
                맞는지 알아보세요
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-subtle-foreground">
                남겨 주시면 영업일 기준 하루 안에 담당자가 연락드립니다.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-[0_20px_60px_-20px_rgba(17,17,19,0.15)] md:p-8">
              <InquiryForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-ink py-12 text-sm text-white/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 md:px-6">
          <p className="flex items-center gap-2 font-bold text-white">
            <span aria-hidden className="size-2.5 rounded-[3px] bg-primary" />
            네이트 시니어
          </p>
          <p>네이트 시니어 · PoC 데모 화면입니다.</p>
        </div>
      </footer>
    </div>
  );
}

function BentoCard({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-3xl bg-surface p-7 md:p-8", className)}>{children}</div>;
}

function IconChip({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-12 items-center justify-center rounded-2xl bg-surface text-primary shadow-sm ring-1 ring-border [&_svg]:size-6">
      {children}
    </span>
  );
}

// 실제 화면을 축소한 제품 창: 왼쪽 기록 입력, 오른쪽 문서 보내기
function ProductWindow() {
  return (
    <div
      aria-hidden
      className="relative mx-auto mt-16 max-w-5xl rounded-t-3xl border border-b-0 border-border bg-surface p-2 pb-0 text-left shadow-[0_30px_80px_-30px_rgba(17,17,19,0.25)]"
    >
      <div className="flex items-center gap-1.5 px-3 py-2.5">
        <span className="size-2.5 rounded-full bg-muted-strong" />
        <span className="size-2.5 rounded-full bg-muted-strong" />
        <span className="size-2.5 rounded-full bg-muted-strong" />
        <span className="ml-3 text-xs text-muted-foreground">네이트 시니어 · 문서 보내기</span>
      </div>
      <div className="grid gap-3 rounded-t-2xl bg-background p-3 md:grid-cols-[260px_1fr] md:p-4">
        <div className="rounded-2xl bg-surface p-5">
          <p className="text-xs font-semibold text-muted-foreground">원본 기록</p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-accent">
            <Mic className="size-3.5" /> 음성 입력
          </span>
          <p className="mt-3 leading-relaxed font-medium">
            점심 반 정도 드심. 노래교실에서 고향의 봄 부르시며 웃으심. 산책 20분.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="aspect-[4/3] rounded-lg bg-[linear-gradient(135deg,#fde3d3,#f6c7ab)]" />
            <div className="aspect-[4/3] rounded-lg bg-[linear-gradient(135deg,#e7e7ea,#d4d4d8)]" />
          </div>
        </div>
        <div className="min-w-0 overflow-hidden rounded-2xl bg-surface">
          <div className="flex border-b border-border px-3 text-sm">
            {OUTPUT_TYPES.map((t, i) => (
              <span
                key={t}
                className={cn(
                  "-mb-px border-b-2 px-2.5 py-3 font-semibold whitespace-nowrap",
                  i === 0 ? "border-primary text-foreground" : "border-transparent text-muted-foreground",
                  i > 1 && "hidden lg:block",
                )}
              >
                {OUTPUT_META[t].label}
              </span>
            ))}
          </div>
          <div className="px-5 py-5 text-[15px] leading-relaxed">
            <p className="font-semibold">김순자 어르신 보호자님, 안녕하세요.</p>
            <p className="mt-2 text-subtle-foreground">
              오늘 어르신께서는 노래교실에서 ‘고향의 봄’을 따라 부르시며 환하게 웃으셨어요. 점심은 반 정도
              드셨고, 20분 정도 산책도 하셨습니다.
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
            <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-accent">보내기 전</span>
            <span className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">보호자에게 보내기</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  name,
  price,
  caption,
  features,
  action,
  highlighted,
}: {
  name: string;
  price: string;
  caption: string;
  features: string[];
  action: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl p-8",
        highlighted ? "bg-ink text-white ring-2 ring-primary" : "border border-border bg-surface",
      )}
    >
      {highlighted && (
        <span className="absolute top-8 right-8 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
          추천
        </span>
      )}
      <p className="text-lg font-bold">{name}</p>
      <p className={cn("mt-1", highlighted ? "text-white/60" : "text-muted-foreground")}>{caption}</p>
      <p className="mt-6 text-4xl font-extrabold tracking-[-0.04em]">{price}</p>
      <ul className="mt-8 flex flex-1 flex-col gap-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check className={cn("mt-1 size-4 shrink-0", highlighted ? "text-accent-on-dark" : "text-primary")} />
            <span className={highlighted ? "text-white/90" : "text-subtle-foreground"}>{f}</span>
          </li>
        ))}
      </ul>
      <a
        href="#inquiry"
        className={cn(cta(highlighted ? "default" : "outline"), "mt-10 w-full")}
      >
        {action}
      </a>
    </div>
  );
}
