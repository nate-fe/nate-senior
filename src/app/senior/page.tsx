import { ArrowRight, Check, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { NavigationDrawer } from "./navigation-drawer";

// UI팀(디자이너·FE) 주간회의 브리핑용 서비스 기획서.
// 사업 구조는 business-spec.md를 짧게 요약하고, 누가 어떤 화면을 쓰는지와 PoC에서 정한 UI 결정을 중심으로 둔다.
// 디자인은 Material Design 3 규칙을 따른다(색 역할·모서리·글씨 단계는 globals.css의 .theme-brief와 md-* 유틸리티).
// 회의실 한 화면을 여럿이 보므로 기본 글씨를 크게(데스크톱 22px) 두고, M3 글씨 단계가 그 비율로 함께 커진다.

export const metadata: Metadata = {
  title: "Senior Platform 서비스 기획서",
  description: "시니어 시장 중개 플랫폼과 PoC(시니어노트·해봄) UI 브리핑",
};

const SECTIONS = [
  { id: "definition", title: "한 줄 정의" },
  { id: "users", title: "누가 어떤 기기로 쓰나" },
  { id: "seniornote", title: "시니어노트" },
  { id: "haebom", title: "해봄" },
  { id: "demo", title: "PoC 바로가기" },
] as const;

export default function SeniorBriefPage() {
  return (
    <div className="theme-brief flex min-h-full flex-1">
      {/* 목차: Material 3 내비게이션 드로어 */}
      <NavigationDrawer sections={SECTIONS} />

      <main className="min-w-0 flex-1">
        <div className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-6 md:px-8 md:py-8">
          <Cover />
          <Definition />
          <Users />
          <SeniorNote />
          <Haebom />
          <Demo />
        </div>
      </main>
    </div>
  );
}

/* ───────────────────────── 공통 조각 (Material 3) ───────────────────────── */

function Section({ id, title, lead, children }: { id: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  const no = SECTIONS.findIndex((s) => s.id === id) + 1;
  return (
    <section id={id} className="scroll-mt-8">
      <p className="md-label-large text-md-primary tabular-nums">{String(no).padStart(2, "0")}</p>
      <h2 className="md-headline-large mt-2 text-md-on-surface">{title}</h2>
      {lead && <p className="md-body-large mt-3 max-w-3xl text-md-on-surface-variant">{lead}</p>}
      {children && <div className="mt-6">{children}</div>}
    </section>
  );
}

// M3 카드: filled(가장 진한 면) / outlined(테두리) / elevated(옅은 그림자)
const CARD = {
  filled: "rounded-[12px] bg-md-surface-container-highest",
  outlined: "rounded-[12px] border border-md-outline-variant bg-md-surface",
  elevated:
    "rounded-[12px] bg-md-surface-container-low shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_3px_1px_rgba(0,0,0,0.15)]",
} as const;

function Card({ variant = "filled", className, children }: { variant?: keyof typeof CARD; className?: string; children: ReactNode }) {
  return <div className={cn(CARD[variant], "p-6", className)}>{children}</div>;
}

// 서비스 custom color 세트
const SERVICE = {
  seniornote: { container: "bg-brief-seniornote-soft text-brief-seniornote-on", color: "text-brief-seniornote", dot: "bg-brief-seniornote" },
  haebom: { container: "bg-brief-haebom-soft text-brief-haebom-on", color: "text-brief-haebom", dot: "bg-brief-haebom" },
  growth: { container: "bg-brief-growth-soft text-brief-growth-on", color: "text-brief-growth", dot: "bg-brief-growth" },
} as const;

// M3 칩: 높이 32dp, 모서리 8dp
function Chip({ service, children }: { service: keyof typeof SERVICE; children: ReactNode }) {
  return (
    <span className={cn("md-label-large inline-flex h-8 items-center rounded-[8px] px-4", SERVICE[service].container)}>
      {children}
    </span>
  );
}

// M3 목록: 앞쪽 아이콘 + 본문
function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col">
      {items.map((item, i) => (
        <li key={i} className="flex min-h-14 items-start gap-4 py-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-md-secondary-container text-md-on-secondary-container">
            <Check className="size-[1.1rem] stroke-[2.5]" />
          </span>
          <span className="md-body-large pt-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ───────────────────────── 표지 ───────────────────────── */

function Cover() {
  return (
    <header className="rounded-[28px] bg-md-primary-container px-6 py-14 text-md-on-primary-container md:px-12 md:py-20">
      <p className="md-title-medium opacity-80">UI팀 주간회의 · 서비스 브리핑(26-10-06)</p>
      <h1 className="md-display-medium mt-4">
        Senior Platform
        <br />
        시니어 시장의 중개 플랫폼
      </h1>
      <div className="mt-8 flex flex-wrap gap-2">
        <span className="md-label-large inline-flex h-8 items-center rounded-[8px] border border-md-outline px-4">
          시니어노트 · 기관 SaaS
        </span>
        <span className="md-label-large inline-flex h-8 items-center rounded-[8px] border border-md-outline px-4">
          해봄 · 경험 마켓플레이스
        </span>
      </div>
    </header>
  );
}

/* ───────────────────────── 1. 한 줄 정의 ───────────────────────── */

function Definition() {
  // 두 가지 연결(입력)이 하나의 결과로 모인다: 돌봄의 연결 + 경험의 자산화 → 경험의 사업화
  const inputs = [
    {
      title: "돌봄의 연결",
      body: "기관 기록으로 가족과 요양기관을 잇는다",
      chip: <Chip service="seniornote">시니어노트</Chip>,
    },
    {
      title: "경험의 자산화",
      body: "시니어가 해본 경험을 사고팔 수 있는 상품으로 만든다",
      chip: <Chip service="haebom">해봄</Chip>,
    },
  ];
  return (
    <Section
      id="definition"
      title={
        <>
          만들지 않고, <span className="text-md-primary">잇는다</span>
        </>
      }
      lead="돌봄의 연결과 경험의 자산화로, 경험의 사업화를 이룹니다."
    >
      <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1.15fr]">
        <InputCard {...inputs[0]} />
        <Operator>
          <Plus className="size-7" />
        </Operator>
        <InputCard {...inputs[1]} />
        <Operator>
          <ArrowRight className="size-7 rotate-90 lg:rotate-0" />
        </Operator>
        {/* 결과: 표지와 같은 primary container로 강조 */}
        <div className="flex flex-col gap-3 rounded-[12px] bg-md-primary-container p-6 text-md-on-primary-container">
          <span className="md-label-large opacity-80">결과</span>
          <span className="md-headline-small">경험의 사업화</span>
          <span className="md-body-large opacity-90">연결된 수요와 자산이 된 경험이 실제 거래와 매출로 이어진다</span>
          <span className="mt-auto">
            <Chip service="growth">Growth</Chip>
          </span>
        </div>
      </div>
    </Section>
  );
}

function InputCard({ title, body, chip }: { title: string; body: string; chip: ReactNode }) {
  return (
    <Card className="flex h-full flex-col gap-3">
      <span className="md-title-large">{title}</span>
      <span className="md-body-large text-md-on-surface-variant">{body}</span>
      <span className="mt-auto">{chip}</span>
    </Card>
  );
}

// 카드 사이의 + / → 기호. 좁은 화면에서는 세로로 쌓이므로 가운데 정렬한다.
function Operator({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden className="flex items-center justify-center py-1 text-md-on-surface-variant">
      {children}
    </span>
  );
}

/* ───────────────────────── 2. 누가 어떤 기기로 쓰나 ───────────────────────── */

function Users() {
  const rows = [
    { service: "seniornote" as const, user: "요양보호사 (50~70대)", device: "모바일", screen: "기록 입력 · 문서 보내기", size: "20px" },
    { service: "seniornote" as const, user: "원장 · 사회복지사", device: "데스크톱", screen: "대시보드 · 문서 확인", size: "20px" },
    { service: "seniornote" as const, user: "보호자 (40~50대 자녀)", device: "모바일", screen: "알림장 · 답글", size: "20px" },
    { service: "seniornote" as const, user: "기관 원장 (도입 검토)", device: "데스크톱", screen: "기관용 랜딩", size: "18px" },
    { service: "haebom" as const, user: "구매자 (모든 연령)", device: "모바일", screen: "경험 둘러보기 · 신청", size: "18px" },
    { service: "haebom" as const, user: "판매자 (시니어)", device: "모바일", screen: "들어온 신청", size: "20px" },
  ];
  return (
    <Section id="users" title="누가 어떤 기기로 쓰나">
      {/* M3 데이터 표: outlined 컨테이너 + 옅은 구분선 */}
      <div className={cn(CARD.outlined, "overflow-hidden")}>
        <table className="w-full table-fixed text-left">
          <thead>
            <tr className="md-title-medium bg-md-surface-container text-md-on-surface-variant">
              <th className="w-[38%] px-4 py-4 md:px-6">사용자</th>
              <th className="hidden w-[16%] px-4 py-4 md:table-cell md:px-6">기기</th>
              <th className="px-4 py-4 md:px-6">주요 화면</th>
              <th className="w-[22%] px-4 py-4 text-right md:w-[18%] md:px-6">기본 글씨</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.user} className="md-body-large border-t border-md-outline-variant">
                <td className="px-4 py-4 md:px-6">
                  <span aria-hidden className={cn("mr-2 inline-block size-3 rounded-full align-middle", SERVICE[r.service].dot)} />
                  <span className="font-medium">{r.user}</span>
                </td>
                <td className="hidden px-4 py-4 text-md-on-surface-variant md:table-cell md:px-6">{r.device}</td>
                <td className="px-4 py-4 md:px-6">{r.screen}</td>
                <td className="px-4 py-4 text-right font-medium tabular-nums md:px-6">{r.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="md-label-large mt-3 flex flex-wrap gap-x-6 gap-y-2 text-md-on-surface-variant">
        <span>
          <span className={cn("mr-2 inline-block size-3 rounded-full align-middle", SERVICE.seniornote.dot)} />
          시니어노트
        </span>
        <span>
          <span className={cn("mr-2 inline-block size-3 rounded-full align-middle", SERVICE.haebom.dot)} />
          해봄
        </span>
      </p>
    </Section>
  );
}

/* ───────────────────────── 3. 시니어노트 ───────────────────────── */

function SeniorNote() {
  const outputs = [
    { label: "보호자 알림장", plan: "Free" },
    { label: "상담 · 활동 기록", plan: "Pro" },
    { label: "월간 활동보고서", plan: "Pro" },
    { label: "공단 제출 문서", plan: "Pro" },
  ];
  return (
    <Section
      id="seniornote"
      title={
        <>
          <span className={SERVICE.seniornote.color}>시니어노트</span> · 기록 1건 → 문서 4종
        </>
      }
      lead="요양보호사가 짧게 남긴 기록을 AI가 받는 사람에 맞는 문서로 다시 씁니다. 알림장은 무료, 나머지 서류는 Pro입니다."
    >
      <div className="grid items-center gap-3 lg:grid-cols-[1fr_auto_1.4fr]">
        <div className={cn("rounded-[12px] p-6", SERVICE.seniornote.container)}>
          <p className="md-label-large opacity-80">기록 1건</p>
          <p className="md-title-large mt-2">“점심 반 정도 드심. 노래교실에서 웃으심.”</p>
        </div>
        <ArrowRight aria-hidden className="mx-auto size-8 rotate-90 text-md-on-surface-variant lg:rotate-0" />
        <ul className="grid grid-cols-2 gap-3">
          {outputs.map((o) => (
            <li key={o.label}>
              <Card variant="outlined" className="flex h-full flex-col gap-3 p-5">
                <span className="md-title-medium">{o.label}</span>
                <span
                  className={cn(
                    "md-label-medium inline-flex h-6 w-fit items-center rounded-[8px] px-2",
                    o.plan === "Free" ? SERVICE.seniornote.container : "bg-md-inverse-surface text-md-inverse-on-surface",
                  )}
                >
                  {o.plan}
                </span>
              </Card>
            </li>
          ))}
        </ul>
      </div>

      <Card variant="elevated" className="mt-3">
        <p className={cn("md-title-medium", SERVICE.seniornote.color)}>PoC에서 정한 UI</p>
        <List
          items={[
            "모바일은 하단 탭 바, 데스크톱은 나무색 사이드바",
            "‘검토 대기’ 없이 초안 확인 후 버튼 한 번으로 전송",
            <>
              알림장 상태는 글자색으로만: <b className="font-medium text-[#c2410c]">보내기 전</b> ·{" "}
              <b className="font-medium text-[#a16207]">확인 전</b> · <b className="font-medium text-[#15803d]">보호자 확인</b>{" "}
              (보내기 전 행만 연한 주황 바탕)
            </>,
          ]}
        />
      </Card>
    </Section>
  );
}

/* ───────────────────────── 4. 해봄 ───────────────────────── */

function Haebom() {
  return (
    <Section
      id="haebom"
      title={
        <>
          <span className={SERVICE.haebom.color}>해봄</span> · 경험을 거래하다
        </>
      }
      lead="시니어가 실제로 해본 경험을 상품으로 팔고, 필요한 사람은 누구나 삽니다."
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div className={cn("rounded-[12px] p-6", SERVICE.haebom.container)}>
          <p className="md-label-large opacity-80">모토</p>
          <p className="md-headline-small mt-2">
            경험이 돈이 되고,
            <br />
            다시 경력이 된다
          </p>
        </div>
        <Card variant="outlined">
          <p className="md-label-large text-md-on-surface-variant">상품 예시</p>
          <p className="md-title-large mt-2">“중고차 살 때 옆에서 같이 봐드려요”</p>
          <p className="md-body-large mt-2 text-md-on-surface-variant">자동차 · 주거 · 생활 · 커리어 4개 분야</p>
        </Card>
      </div>

      <Card variant="elevated" className="mt-3">
        <p className={cn("md-title-medium", SERVICE.haebom.color)}>PoC에서 정한 UI</p>
        <List
          items={[
            "구매자 화면은 이름을 가리고(김○○) 나이는 연령대(60대)로만",
            "얼굴 대신 분야 아이콘, 프로필 사진은 신청 직전 화면과 판매자 본인 화면에서만",
            "호칭은 ‘판매자님’ 대신 ‘님’·‘해본 분’",
          ]}
        />
      </Card>
    </Section>
  );
}

/* ───────────────────────── 5. PoC 바로가기 ───────────────────────── */

function Demo() {
  return (
    <Section
      id="demo"
      title={
        // 제목 자체가 전체 화면 목록(/)으로 가는 링크. 브리핑 화면은 그대로 두도록 새 탭에서 연다.
        <Link
          href="/"
          target="_blank"
          className="text-md-primary underline decoration-2 underline-offset-8 hover:decoration-4"
        >
          PoC 바로가기
        </Link>
      }
    />
  );
}
