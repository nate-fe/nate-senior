import { ArrowDown, ArrowRight, Check, ChevronRight, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { NavigationDrawer } from "./navigation-drawer";

// 피드백 미팅용 서비스 브리핑(26-11-25). 최근 과제를 화면으로 직접 설명하는 자리다.
// 근거는 business-spec.md. 표지 → 출발점(장기 방향 → PoC 도출) → 장 순서: 01 포지셔닝 → 02 시작 전략 → 03 시니어노트(수요) → 04 해봄(공급), 끝에 PoC 바로가기.
// 슬라이드형: 넓은 화면에서 <Slide> 1장 = 화면 1개. 내용이 긴 장은 여러 장(1/2, 2/2)으로 나눈다.
//   기본 글씨가 화면 높이에 비례하므로(globals.css) 화면 크기가 달라도 한 장이 한 화면에 들어간다.
// 문구 원칙: 모든 문장은 명사형 종결(개조식), 한 줄 안에 끝나는 길이. 설명은 발표자가 말로 하고 화면은 키워드만 둔다.
// 디자인은 Material Design 3 규칙을 따른다(색 역할·모서리·글씨 단계는 globals.css의 .theme-brief와 md-* 유틸리티).

export const metadata: Metadata = {
  title: "Senior Platform 서비스 브리핑",
  description: "시니어 시장 중개 플랫폼의 사업 구조와 PoC(시니어노트·해봄) 피드백 미팅 자료",
};

const SECTIONS = [
  { id: "positioning", title: "포지셔닝" },
  { id: "strategy", title: "시작 전략" },
  { id: "seniornote", title: "시니어노트" },
  { id: "haebom", title: "해봄" },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];

export default function SeniorBriefPage() {
  return (
    <div className="theme-brief flex min-h-full flex-1">
      {/* 목차: Material 3 내비게이션 드로어. 장의 첫 슬라이드 id로 현재 위치를 잡는다. */}
      <NavigationDrawer sections={SECTIONS} />

      <main className="min-w-0 flex-1">
        <Cover />
        <Vision />
        <PositioningCore />
        <Positioning />
        <StrategyWhy />
        <SeniorNoteValue />
        <SeniorNoteRoadmap />
        <SeniorNoteUi />
        <HaebomConcept />
        <HaebomRoadmap />
        <HaebomUi />
        <PocLink />
      </main>
    </div>
  );
}

/* ───────────────────────── 공통 조각 (Material 3) ───────────────────────── */

// 슬라이드 틀: 넓은 화면에서 화면 높이만큼 차지하고, 스크롤이 슬라이드 시작점에 멈춘다.
function SlideFrame({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section id={id} className="flex flex-col justify-center px-4 py-10 md:px-10 lg:min-h-svh lg:snap-start lg:py-8">
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

// 장 슬라이드: "03 — 시니어노트 1/2" 꼬리표 + 핵심 메시지 한 줄 + 보조 한 줄
function Slide({
  chapter,
  part,
  title,
  lead,
  children,
}: {
  chapter: SectionId;
  part?: [number, number];
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
}) {
  const no = SECTIONS.findIndex((s) => s.id === chapter);
  // 장의 첫 슬라이드만 목차가 찾는 id를 갖는다
  const id = !part || part[0] === 1 ? chapter : `${chapter}-${part[0]}`;
  return (
    <SlideFrame id={id}>
      <p className="md-label-large flex items-center gap-2 text-md-primary">
        <span className="tabular-nums">{String(no + 1).padStart(2, "0")}</span>
        <span aria-hidden className="h-px w-6 bg-md-primary/40" />
        {SECTIONS[no].title}
        {part && (
          <span className="ml-1 text-md-on-surface-variant tabular-nums">
            {part[0]}/{part[1]}
          </span>
        )}
      </p>
      <h2 className="md-display-small mt-3 font-semibold tracking-[-0.02em] text-md-on-surface">{title}</h2>
      {lead && <p className="md-title-large mt-2 text-md-on-surface-variant">{lead}</p>}
      <div className="mt-8 flex flex-col gap-8">{children}</div>
    </SlideFrame>
  );
}

// 슬라이드 안의 묶음 제목
function Block({ title, note, children }: { title: ReactNode; note?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="md-title-large font-semibold text-md-on-surface">{title}</h3>
        {note && <span className="md-label-large text-md-on-surface-variant">{note}</span>}
      </div>
      {children}
    </div>
  );
}

// 서비스 custom color 세트
const SERVICE = {
  seniornote: { container: "bg-brief-seniornote-soft text-brief-seniornote-on", color: "text-brief-seniornote", dot: "bg-brief-seniornote" },
  haebom: { container: "bg-brief-haebom-soft text-brief-haebom-on", color: "text-brief-haebom", dot: "bg-brief-haebom" },
  growth: { container: "bg-brief-growth-soft text-brief-growth-on", color: "text-brief-growth", dot: "bg-brief-growth" },
} as const;
type ServiceKey = keyof typeof SERVICE;

// M3 칩: 높이 32dp, 모서리 8dp
function Chip({ service, children }: { service: ServiceKey; children: ReactNode }) {
  return (
    <span className={cn("md-label-large inline-flex h-8 w-fit items-center rounded-[8px] px-3", SERVICE[service].container)}>
      {children}
    </span>
  );
}

// 회색 기능 칩(요금제별 기능 등)
function FeatureChips({ items }: { items: string[] }) {
  return (
    <span className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span key={t} className="md-label-large inline-flex h-8 items-center rounded-[8px] bg-md-surface-container px-3 text-md-on-surface">
          {t}
        </span>
      ))}
    </span>
  );
}

// 작은 꼬리표(추정 등)
function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="md-label-medium inline-flex h-6 w-fit shrink-0 items-center rounded-[6px] border border-md-outline px-2 text-md-on-surface-variant">
      {children}
    </span>
  );
}

function PlanBadge({ plan }: { plan: "Free" | "Pro" }) {
  return (
    <span
      className={cn(
        "md-label-medium inline-flex h-6 w-fit shrink-0 items-center rounded-[6px] px-2",
        plan === "Free" ? SERVICE.seniornote.container : "bg-md-inverse-surface text-md-inverse-on-surface",
      )}
    >
      {plan}
    </span>
  );
}

function Dot({ service }: { service: ServiceKey }) {
  return <span aria-hidden className={cn("inline-block size-2.5 shrink-0 rounded-full", SERVICE[service].dot)} />;
}

// 키워드 카드: 굵은 키워드 한 줄 + 보조 한 줄
function KeyCard({ kicker, title, sub, className }: { kicker?: ReactNode; title: ReactNode; sub?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex h-full flex-col gap-2 rounded-[16px] bg-md-surface-container-low p-6", className)}>
      {kicker && <span className="md-label-large opacity-80">{kicker}</span>}
      <span className="md-headline-small font-semibold tracking-[-0.01em]">{title}</span>
      {sub && <span className="md-body-large opacity-80">{sub}</span>}
    </div>
  );
}

// 카드 사이 화살표(넓은 화면에서만)
function Chevron({ from = "md" }: { from?: "md" | "lg" }) {
  return (
    <ChevronRight
      aria-hidden
      className={cn(
        "absolute top-1/2 -right-[1.15rem] z-10 hidden size-6 -translate-y-1/2 rounded-full bg-md-surface text-md-outline",
        from === "md" ? "md:block" : "lg:block",
      )}
    />
  );
}

// 사용자 카드: 사용자 · 기기 · 기본 글씨 · 주요 화면
function UserCards({ rows }: { rows: { user: string; device: string; size: string; screen: string }[] }) {
  return (
    <ul className={cn("grid gap-3 sm:grid-cols-2", rows.length > 2 && "lg:grid-cols-4")}>
      {rows.map((r) => (
        <li key={r.user} className="flex flex-col gap-1 rounded-[16px] border border-md-outline-variant bg-md-surface-container-lowest p-5">
          <span className="md-title-medium">{r.user}</span>
          <span className="md-label-large font-normal text-md-on-surface-variant">
            {r.device} · 글씨 <span className="tabular-nums">{r.size}</span>
          </span>
          <span className="md-label-large mt-1">{r.screen}</span>
        </li>
      ))}
    </ul>
  );
}

// PoC UI 결정과 근거: 옅은 구분선만 두는 M3 데이터 표
function DecisionTable({ rows }: { rows: [ReactNode, ReactNode][] }) {
  return (
    <div className="overflow-x-auto rounded-[16px] border border-md-outline-variant bg-md-surface-container-lowest">
      <table className="w-full min-w-[36rem] text-left">
        <thead>
          <tr className="md-label-large text-md-on-surface-variant">
            <th className="w-[52%] px-5 pt-3 pb-2 font-medium md:px-6">결정</th>
            <th className="px-5 pt-3 pb-2 font-medium md:px-6">근거</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="md-body-large border-t border-md-outline-variant align-top">
              <td className="px-5 py-3 font-semibold md:px-6">{r[0]}</td>
              <td className="px-5 py-3 text-md-on-surface-variant md:px-6">{r[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ───────────────────────── 표지 ───────────────────────── */

function Cover() {
  // 한 줄 요약: 개인의 경험 → 가족·돌봄현장 → 시니어 산업 생태계로 확장
  const flow = ["개인의 경험", "가족·돌봄현장", "시니어 산업 생태계로 확장"];
  return (
    <SlideFrame>
      <header className="rounded-[28px] bg-md-inverse-surface px-6 py-14 text-md-inverse-on-surface md:px-14 md:py-20">
        <p className="md-title-medium opacity-70">피드백 미팅 · 서비스 브리핑 · 26.11.25</p>
        <h1 className="md-display-medium mt-5 font-semibold tracking-[-0.02em]">
          Senior Platform
          <br />
          <span className="opacity-80">시니어 시장의 중개 플랫폼</span>
        </h1>
        <ol className="md-headline-small mt-14 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/15 pt-8 font-semibold">
          {flow.map((f, i) => (
            <li key={f} className="flex items-center gap-4">
              {f}
              {i < flow.length - 1 && <ArrowRight aria-hidden className="size-6 opacity-50" />}
            </li>
          ))}
        </ol>
      </header>
    </SlideFrame>
  );
}

/* ───────────────────────── 출발점: 장기 방향 → PoC ───────────────────────── */

// 장기 방향 문구에서 이번 PoC를 도출했다는 출발점. 장 번호 없이 표지 바로 뒤에 둔다.
function Vision() {
  const pillars = [
    { service: "haebom" as const, name: "해봄", verb: "경험을 거래하고", poc: "경험 거래 PoC", sub: "구매자 · 판매자 화면" },
    { service: "seniornote" as const, name: "시니어노트", verb: "돌봄을 연결하고", poc: "돌봄 연결 PoC", sub: "기록 1건 → 문서 4종 · 보호자 알림장" },
    { service: "growth" as const, name: "Senior Growth Platform", verb: "새로운 사업을 탄생시키는", poc: "이후 연계 단계", sub: "두 PoC의 수요 · 공급 위에서 확장", later: true },
  ];
  return (
    <SlideFrame id="vision">
      <p className="md-label-large flex items-center gap-2 text-md-primary">
        출발점
        <span aria-hidden className="h-px w-6 bg-md-primary/40" />
        장기 방향
      </p>
      <h2 className="md-display-small mt-3 font-semibold tracking-[-0.02em] text-md-on-surface">
        장기 방향에서 <span className="text-md-primary">도출한 PoC</span>
      </h2>

      {/* 장기 방향 원문 */}
      <blockquote className="mt-8 rounded-[20px] bg-md-inverse-surface px-6 py-8 text-md-inverse-on-surface md:px-10">
        <ul className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-baseline md:gap-x-3">
          {pillars.map((p, i) => (
            <li key={p.name} className="md-title-large flex items-baseline gap-2">
              <Dot service={p.service} />
              <b className="font-semibold">{p.name}</b>
              <span className="opacity-80">{p.verb}</span>
              {i < pillars.length - 1 && <span className="hidden opacity-40 md:inline">·</span>}
            </li>
          ))}
        </ul>
        {/* span은 인라인이라 mt가 먹지 않으므로, 한 줄로 묶는 블록에 위아래 여백을 준다 */}
        <div className="mt-6 mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="md-headline-large font-semibold tracking-[-0.02em]">「 NATE Senior Ecosystem 」</span>
          <span className="md-title-medium opacity-70">을 만드는 것이 장기 방향</span>
        </div>
      </blockquote>

      <p className="md-label-large my-4 flex items-center justify-center gap-2 text-md-on-surface-variant">
        <ArrowDown aria-hidden className="size-5" />이 문구에서 도출한 PoC
      </p>

      <ol className="grid gap-3 md:grid-cols-3">
        {pillars.map((p) => (
          <li
            key={p.name}
            className={cn(
              "flex flex-col gap-2 rounded-[16px] p-5",
              p.later ? "border border-dashed border-md-outline bg-transparent" : SERVICE[p.service].container,
            )}
          >
            <span className={cn("md-label-large", p.later ? "text-md-on-surface-variant" : "opacity-80")}>{p.name}</span>
            <span className="md-headline-small font-semibold">{p.poc}</span>
            <span className={cn("md-label-large font-normal", p.later ? "text-md-on-surface-variant" : "opacity-80")}>{p.sub}</span>
          </li>
        ))}
      </ol>
    </SlideFrame>
  );
}

/* ───────────────────────── 01 포지셔닝 ───────────────────────── */

// 01의 본질: 해봄(경험의 자산화) → NATE Senior Platform → 시니어노트(돌봄의 연결), 그리고 Senior Growth(경험의 사업화).
// 세 서비스를 제휴사와 함께 하나의 Value Chain으로 잇는 구조도.
function PositioningCore() {
  return (
    <Slide
      chapter="positioning"
      part={[1, 2]}
      title={
        <>
          만들지 않고, <span className="text-md-primary">잇는</span> 플랫폼
        </>
      }
      lead="연결의 운영"
    >
      <div className="flex flex-col gap-3">
        <div className="grid gap-3 lg:grid-cols-[1.15fr_2rem_1.45fr_2rem_1.15fr]">
          <ServiceColumn
            service="haebom"
            title="해봄 | 경험의 자산화"
            steps={["전문가 확보", "경험상담", "자문·프로젝트"]}
          />
          <FlowArrow />

          {/* 가운데: 플랫폼 → 아래로 Senior Growth */}
          <div className="flex flex-col">
            <div className="flex h-[7.5rem] flex-col items-center justify-center gap-1 rounded-[16px] bg-md-inverse-surface px-4 text-center text-md-inverse-on-surface">
              <span className="md-title-large font-semibold">NATE Senior Platform</span>
              <span className="md-label-large font-normal opacity-80">해봄 · 시니어노트 · Senior Growth</span>
              <span className="md-label-large font-normal italic opacity-70">고객 × 전문가 × 기관 × 서비스 연결</span>
            </div>
            <ArrowDown aria-hidden className="mx-auto my-1.5 size-6 text-md-outline" />
            <div className="flex flex-1 flex-col gap-4 rounded-[16px] border border-brief-growth/30 bg-brief-growth-soft/50 p-5">
              <span className="md-title-medium flex h-11 items-center justify-center rounded-full bg-brief-growth px-4 text-white">
                Senior Growth | 경험의 사업화
              </span>
            </div>
          </div>

          <FlowArrow />
          <ServiceColumn
            service="seniornote"
            title="시니어노트 | 돌봄의 연결"
            steps={["기관 기록", "AI 요약", "보호자 소통"]}
          />
        </div>

      </div>
    </Slide>
  );
}

// 구조도의 좌우 서비스 열: 진한 제목 알약 + 세로 단계
function ServiceColumn({ service, title, steps }: { service: ServiceKey; title: string; steps: string[] }) {
  return (
    <div className="flex flex-col gap-3 rounded-[16px] border border-md-outline-variant bg-md-surface-container-lowest p-4">
      <span className="md-title-medium flex h-11 items-center justify-center rounded-full bg-md-inverse-surface px-3 whitespace-nowrap text-md-inverse-on-surface">
        {title}
      </span>
      <ol className="flex flex-col items-stretch">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-col items-center">
            <span className={cn("md-label-large flex h-10 w-full items-center justify-center rounded-[8px]", SERVICE[service].container)}>{s}</span>
            {i < steps.length - 1 && <ArrowDown aria-hidden className="my-0.5 size-4 text-md-outline" />}
          </li>
        ))}
      </ol>
    </div>
  );
}

// 좌우 열 → 가운데 플랫폼 상자 높이에 맞춘 가로 화살표(넓은 화면에서만)
function FlowArrow() {
  return (
    <span aria-hidden className="hidden h-[7.5rem] items-center justify-center text-md-outline lg:flex">
      <ArrowRight className="size-6" />
    </span>
  );
}

function Positioning() {
  const roles: { step: string; owner: ReactNode; sub: string; moat?: boolean }[] = [
    { step: "수요 모집", owner: <Chip service="seniornote">시니어노트</Chip>, sub: "무료 알림장 · 보호자 초대" },
    { step: "공급 연결", owner: <Chip service="haebom">해봄</Chip>, sub: "시니어 경험 · 사업자 서비스" },
    { step: "시장 검증", owner: <Chip service="growth">Growth</Chip>, sub: "현장 실증 · 돌봄 기록 데이터", moat: true },
    { step: "거래 전환", owner: <span className="md-label-large text-md-on-surface-variant">Pro · Funding · 커머스</span>, sub: "구독 · 펀딩 · 판매" },
  ];
  return (
    <Slide chapter="positioning" part={[2, 2]} title="연결 플랫폼의 역할" >

      <Block title="플랫폼의 네 가지 역할">
        <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {roles.map((r, i) => (
            <li
              key={r.step}
              className={cn(
                "relative flex flex-col gap-3 rounded-[16px] p-5",
                r.moat ? "bg-md-inverse-surface text-md-inverse-on-surface" : "border border-md-outline-variant bg-md-surface-container-lowest",
              )}
            >
              <span className="flex items-center justify-between">
                <span className="md-label-large tabular-nums opacity-70">{String(i + 1).padStart(2, "0")}</span>
                {r.moat && <span className="md-label-medium rounded-[6px] bg-white/15 px-2 py-0.5">차별점</span>}
              </span>
              <span className="md-headline-small font-semibold">{r.step}</span>
              <span className={cn("md-label-large font-normal", r.moat ? "opacity-80" : "text-md-on-surface-variant")}>{r.sub}</span>
              <span className="mt-auto pt-1">{r.owner}</span>
              {i < roles.length - 1 && <Chevron from="lg" />}
            </li>
          ))}
        </ol>
      </Block>
    </Slide>
  );
}

/* ───────────────────────── 02 시작 전략 ───────────────────────── */

function StrategyWhy() {
  const reasons = [
    { title: "단독 효용", sub: "기록 1건 → 문서 4종", detail: "다른 사용자 없이도 매일 사용" },
    { title: "묶음 유입", sub: "기관 1곳 = 어르신 + 보호자", detail: "기관 도입 시 가족까지 동반 유입" },
    { title: "수요 신호", sub: "기록 누적 → 서비스 수요 포착", detail: "예: 식사량 감소 → 영양 서비스" },
  ];
  return (
    <Slide
      chapter="strategy"
      title={
        <>
          첫 단추, <span className="text-md-primary">기관 SaaS</span>
        </>
      }
    >
      <ol className="grid gap-3 md:grid-cols-3">
        {reasons.map((r, i) => (
          <li key={r.title} className="flex flex-col gap-3 rounded-[16px] border border-md-outline-variant bg-md-surface-container-lowest p-6">
            <span className="md-headline-large font-semibold text-md-primary/30 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <span className="md-headline-small font-semibold">{r.title}</span>
            <span className="md-title-medium">{r.sub}</span>
            <span className="md-body-large text-md-on-surface-variant">{r.detail}</span>
          </li>
        ))}
      </ol>

      <Block title="PoC의 두 축">
        <div className="grid gap-3 md:grid-cols-2">
          <KeyCard className={SERVICE.seniornote.container} kicker="수요 축 · 시니어노트" title="기관의 매일 사용" sub="무료 → 유료 전환 여부" />
          <KeyCard className={SERVICE.haebom.container} kicker="공급 축 · 해봄" title="경험별 지불 의사" sub="누가 · 어떤 경험에 · 얼마를" />
        </div>
      </Block>
    </Slide>
  );
}

/* ───────────────────────── 03 시니어노트 ───────────────────────── */

function SeniorNoteValue() {
  const outputs: { label: string; to: string; plan: "Free" | "Pro" }[] = [
    { label: "보호자 알림장", to: "보호자", plan: "Free" },
    { label: "상담 · 활동 기록", to: "사회복지사", plan: "Pro" },
    { label: "월간 활동보고서", to: "센터 내부", plan: "Pro" },
    { label: "공단 제출 문서", to: "건강보험공단", plan: "Pro" },
  ];
  return (
    <Slide
      chapter="seniornote"
      part={[1, 3]}
      title={
        <>
          기록 1건 <ArrowRight aria-hidden className="inline size-[0.8em] align-[-0.05em] text-md-outline" />{" "}
          <span className={SERVICE.seniornote.color}>문서 4종</span>
        </>
      }
      lead="요양보호사의 짧은 기록 → AI의 대상별 재작성"
    >
      <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1.5fr]">
        <div className={cn("flex h-full flex-col justify-center gap-3 rounded-[16px] p-6", SERVICE.seniornote.container)}>
          <span className="md-label-large opacity-80">기록 1건 · 음성 · 텍스트 · 사진</span>
          <span className="md-headline-small font-semibold">“점심 반 정도 드심. 노래교실에서 웃으심.”</span>
        </div>
        <ArrowRight aria-hidden className="mx-auto size-8 rotate-90 text-md-outline lg:rotate-0" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {outputs.map((o) => (
            <li key={o.label} className="flex flex-col gap-1 rounded-[16px] border border-md-outline-variant bg-md-surface-container-lowest p-5">
              <span className="flex items-center justify-between gap-2">
                <span className="md-title-large font-semibold">{o.label}</span>
                <PlanBadge plan={o.plan} />
              </span>
              <span className="md-label-large font-normal text-md-on-surface-variant">→ {o.to}</span>
            </li>
          ))}
        </ul>
      </div>

      <Block title="요금 구조" note="무료 유입 → 쌓인 기록으로 유료 전환">
        <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex flex-col gap-3 rounded-[16px] border border-md-outline-variant bg-md-surface-container-lowest p-5">
            <span className="flex items-center gap-3">
              <PlanBadge plan="Free" />
              <span className="md-title-medium">기관 · 보호자 유입 통로</span>
            </span>
            <FeatureChips items={["기본 알림장", "보호자 초대", "사진 · 활동 공유"]} />
          </div>
          <ArrowRight aria-hidden className="mx-auto size-7 rotate-90 self-center text-md-outline md:rotate-0" />
          <div className="flex flex-col gap-3 rounded-[16px] border border-md-outline-variant bg-md-surface-container-lowest p-5">
            <span className="flex items-center gap-3">
              <PlanBadge plan="Pro" />
              <span className="md-title-medium">서류 부담 감소 = 결제 이유</span>
            </span>
            <FeatureChips items={["AI 문서 자동 생성", "월간 리포트", "기록 검색", "기관별 템플릿", "업무관리 · 통계"]} />
          </div>
        </div>
      </Block>
    </Slide>
  );
}

// 시니어노트의 확장 단계(시니어노트 영역에만 해당)
function SeniorNoteRoadmap() {
  const stages = [
    { stage: "1단계", name: "기관 SaaS", payer: "요양기관", revenue: "Pro 구독료", now: true },
    { stage: "2단계", name: "가족 Care", payer: "보호자", revenue: "가족 서비스 이용료" },
    { stage: "3단계", name: "건강·요양·생활서비스 연계", payer: "사업자", revenue: "수수료 · 실증 비용 · 입점료" },
  ];
  return (
    <Slide chapter="seniornote" part={[2, 3]} title="3단계 확장 로드맵">
      <Block title="단계별 지불 주체 · 수익원" note={<Tag>수익원 추정</Tag>}>
        <ol className="grid gap-3 md:grid-cols-3">
          {stages.map((s, i) => (
            <li
              key={s.stage}
              className={cn(
                "relative flex flex-col gap-4 rounded-[16px] p-6",
                s.now ? "bg-md-primary text-md-on-primary" : "border border-md-outline-variant bg-md-surface-container-lowest",
              )}
            >
              <span className="flex items-center justify-between">
                <span className="md-label-large opacity-70">{s.stage}</span>
              </span>
              <span className="md-headline-small font-semibold">{s.name}</span>
              <dl className="md-label-large mt-auto grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-normal">
                <dt className="opacity-70">지불 주체</dt>
                <dd>{s.payer}</dd>
                <dt className="opacity-70">수익원</dt>
                <dd>{s.revenue}</dd>
              </dl>
              {i < stages.length - 1 && <Chevron />}
            </li>
          ))}
        </ol>
      </Block>

    </Slide>
  );
}

function SeniorNoteUi() {
  return (
    <Slide chapter="seniornote" part={[3, 3]} title="현장 인력 기준의 화면" lead="50~70대 요양보호사 · 40~50대 보호자 중심 설계">
      <Block title="사용자 · 기기">
        <UserCards rows={[
            { user: "요양보호사 (50~70대)", device: "모바일", size: "20px", screen: "기록 입력 · 문서 전송" },
            { user: "원장 · 사회복지사", device: "데스크톱", size: "20px", screen: "대시보드 · 문서 확인" },
            { user: "보호자 (40~50대 자녀)", device: "모바일", size: "20px", screen: "알림장 · 답글" },
            { user: "기관 원장 (도입 검토)", device: "데스크톱", size: "18px", screen: "랜딩 · 요금제 · 도입 문의" },
          ]}
        />
      </Block>

      <Block title="PoC UI 결정">
        <DecisionTable
          rows={[
            ["모바일 하단 탭 바 · 데스크톱 사이드바", "현장 기록은 모바일, 관리는 데스크톱"],
            ["‘검토 대기’ 단계 제거, 초안 확인 후 1회 전송", "사람 확인 원칙 유지 + 현장 단계 축소"],
            [
              <span key="s">
                알림장 상태 3색 구분 ·{" "}
                <span className="font-medium">
                  <span className="text-[#c2410c]">보내기 전</span> · <span className="text-[#a16207]">확인 전</span> ·{" "}
                  <span className="text-[#15803d]">보호자 확인</span>
                </span>
              </span>,
              "미발송 건의 즉시 식별",
            ],
            ["기본 글씨 20px · 큰 터치 영역", "50~70대 현장 인력 기준"],
          ]}
        />
      </Block>
    </Slide>
  );
}

/* ───────────────────────── 04 해봄 ───────────────────────── */

function HaebomConcept() {
  const fields = [
    { name: "자동차", items: "중고차 구매 동행 · 차량 체크 · 정비 상담" },
    { name: "주거", items: "부동산 계약 상담 · 정리 수납 코칭" },
    { name: "생활", items: "요리 · 레시피 코칭" },
    { name: "커리어", items: "퇴직 · 이직 상담 · 실무 멘토링" },
  ];
  return (
    <Slide
      chapter="haebom"
      part={[1, 3]}
      title={
        <>
          ‘해 본 경험’의 <span className={SERVICE.haebom.color}>거래</span>
        </>
      }
      lead="은퇴 시니어의 실전 경험 → 필요한 사람에게 판매"
    >
      <div className="grid gap-3 md:grid-cols-[1.1fr_1fr]">
        <div className={cn("flex flex-col justify-between gap-5 rounded-[16px] p-6", SERVICE.haebom.container)}>
          <span className="md-label-large opacity-80">모토</span>
          <span className="md-headline-large font-semibold tracking-[-0.02em]">
            “경험이 돈이 되고,
            <br />
            다시 경력이 된다”
          </span>
          <span className="md-body-large">경쟁력 · 전문가 수가 아닌 믿고 살 수 있는 경험</span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-1 flex-col justify-center gap-1 rounded-[16px] border border-md-outline-variant p-5">
            <span className="md-label-large flex items-center gap-2 text-md-outline">
              <X className="size-4" /> 경력
            </span>
            <span className="md-title-large text-md-on-surface-variant line-through decoration-1">자동차 업계 30년 경력</span>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1 rounded-[16px] border-2 border-brief-haebom bg-md-surface-container-lowest p-5">
            <span className={cn("md-label-large flex items-center gap-2", SERVICE.haebom.color)}>
              <Check className="size-4 stroke-[2.5]" /> 경험
            </span>
            <span className="md-title-large font-semibold">중고차 구매 동행</span>
          </div>
        </div>
      </div>

      <Block title="4개 분야" note={<Tag>제공 형태 추정</Tag>}>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {fields.map((f) => (
            <li key={f.name} className="flex flex-col gap-1 rounded-[16px] border border-md-outline-variant bg-md-surface-container-lowest p-5">
              <span className="md-title-large font-semibold">{f.name}</span>
              <span className="md-label-large font-normal text-md-on-surface-variant">{f.items}</span>
            </li>
          ))}
        </ul>
      </Block>
    </Slide>
  );
}

// 해봄의 확장 단계. 시니어노트 로드맵과 같은 카드 모양에, 출발점(1단계)만 해봄 색으로 강조한다.
function HaebomRoadmap() {
  const stages = [
    { stage: "1단계", name: "거래 수수료", body: "경험 상담 · 동행 · 코칭 거래" },
    { stage: "2단계", name: "Premium Expert", body: "상위 전문가 · 인증 프로그램" },
    { stage: "3단계", name: "B2B", body: "기업 · 스타트업의 시니어 전문가 자문" },
    { stage: "4단계", name: "Gig Work 확장", body: "단기 프로젝트 · 현장 업무 Matching" },
  ];
  return (
    <Slide chapter="haebom" part={[2, 3]} title="4단계 확장 로드맵">
      <Block title="단계별 수익 모델">
        <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {stages.map((s, i) => (
            <li
              key={s.stage}
              className={cn(
                "relative flex min-h-[13rem] flex-col gap-4 rounded-[16px] p-6",
                i === 0 ? SERVICE.haebom.container : "border border-md-outline-variant bg-md-surface-container-lowest",
              )}
            >
              <span className="md-label-large opacity-70">{s.stage}</span>
              <span className="md-headline-small font-semibold">{s.name}</span>
              <span className={cn("md-label-large mt-auto font-normal", i === 0 ? "opacity-80" : "text-md-on-surface-variant")}>{s.body}</span>
              {i < stages.length - 1 && <Chevron from="lg" />}
            </li>
          ))}
        </ol>
      </Block>
    </Slide>
  );
}

function HaebomUi() {
  return (
    <Slide chapter="haebom" part={[3, 3]} title="신뢰 중심의 화면" lead="판매자 보호 · 구매자 신뢰의 균형">
      <Block title="사용자 · 기기">
        <UserCards rows={[
            { user: "구매자 (모든 연령)", device: "모바일", size: "18px", screen: "경험 탐색 · 후기 · 신청" },
            { user: "판매자 (시니어)", device: "모바일", size: "20px", screen: "신청 확인 · 응답" },
          ]}
        />
      </Block>

      <Block title="PoC UI 결정">
        <DecisionTable
          rows={[
            ["이름 마스킹(김○○) · 연령대 표기(60대)", "판매자 개인정보 보호 · 경험 중심 판단"],
            ["얼굴 대신 분야 아이콘, 사진은 신청 직전에만", "외모 · 나이 선입견 최소화"],
            ["상세 화면 이용 후기 노출", "구매 신뢰 장치"],
            ["호칭 ‘님’ · ‘해본 분’", "판매자가 아닌 경험 공유자로서의 존중"],
          ]}
        />
      </Block>
    </Slide>
  );
}

/* ───────────────────────── 끝: PoC 바로가기 ───────────────────────── */

function PocLink() {
  return (
    <SlideFrame>
      <div className="flex flex-col items-center gap-8 text-center">
        <p className="md-label-large text-md-on-surface-variant">PoC 준비 상태</p>
        <span className="flex flex-wrap justify-center gap-2">
          <Chip service="seniornote">시니어노트 화면</Chip>
          <Chip service="haebom">해봄 구매자 · 판매자 화면</Chip>
        </span>
        {/* 브리핑 화면은 그대로 두도록 새 탭에서 연다 */}
        <Link
          href="/"
          target="_blank"
          className="md-title-large inline-flex h-16 items-center justify-center gap-3 rounded-full bg-md-primary px-10 font-semibold text-md-on-primary hover:opacity-90"
        >
          PoC 바로가기
          <ArrowRight className="size-6" />
        </Link>
      </div>
    </SlideFrame>
  );
}
