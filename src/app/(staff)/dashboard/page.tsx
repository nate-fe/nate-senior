"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NoticeStatus } from "@/components/notice-status";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Guardian, Resident } from "@/entities";
import { track } from "@/features/analytics/track";
import { PlanGate, usePlan } from "@/features/plan-gate";
import { useRole } from "@/features/session/role";
import type { RecordSummary } from "@/lib/api";
import { useGuardians, useRecords, useReplies, useResidents, useSetPlan } from "@/lib/queries";
import { cn, formatDateTime, formatDay, formatTime } from "@/lib/utils";

const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();

const th = "bg-wood-soft px-3 py-3.5 md:px-4 text-left text-base font-bold text-wood-strong whitespace-nowrap";
const td = "px-3 py-5 align-middle md:px-4";
// 통계 막대는 카키 → 브라운 → 오렌지 순으로 돌려 쓴다
const BAR_COLORS = ["bg-primary", "bg-wood", "bg-accent"];

export default function DashboardPage() {
  const { data: residents = [] } = useResidents();
  const { data: guardians = [] } = useGuardians();
  const { data: records = [] } = useRecords();
  const { data: replies = [] } = useReplies();
  const { isPro } = usePlan();
  const setPlan = useSetPlan();
  const { isAdmin, href: roleHref } = useRole();

  const outputs = records.flatMap((r) => r.outputs);
  const notices = outputs.filter((o) => o.type === "guardian_notice");
  const sentToday = notices.filter((o) => o.status === "sent" && isToday(o.updatedAt)).length;
  const sentNotices = notices.filter((o) => o.status === "sent");
  const readNotices = sentNotices.filter((o) => o.readAt).length;
  const todayReplies = replies.filter((r) => isToday(r.createdAt)).length;
  const connectedResidents = residents.filter((r) =>
    r.guardianIds.some((gid) => guardians.find((g) => g.id === gid)?.joined),
  ).length;
  const connectRate = residents.length ? Math.round((connectedResidents / residents.length) * 100) : 0;

  const today = new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });

  const stats: StatItem[] = [
    { label: "오늘 보낸 알림장", value: sentToday, unit: "건", tone: "khaki" },
    {
      label: "보호자 확인",
      value: readNotices,
      unit: "건",
      hint: `보낸 알림장 ${sentNotices.length}건 중`,
      tone: "orange",
    },
    // 보호자 확보율은 기관 운영 지표라 원장에게만 보여 준다.
    ...(isAdmin
      ? [
          {
            label: "보호자 연결",
            value: connectRate,
            unit: "%",
            hint: `${connectedResidents} / ${residents.length}명`,
            tone: "wood" as const,
          },
          // 보호자가 기관에 보낸 반응. 원장이 직접 확인하고 대응할 내용이다.
          {
            label: "보호자 답글",
            value: todayReplies,
            unit: "건",
            hint: `오늘 받은 답글 · 전체 ${replies.length}건`,
            tone: "walnut" as const,
          },
        ]
      : []),
  ];

  const upgrade = (from: string) => {
    track("upgrade_clicked", { from });
    setPlan.mutate("pro", { onSuccess: () => track("plan_changed", { to: "pro" }) });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-[-0.04em] md:text-4xl">{today}</h1>
        <Link href={roleHref("/records/new")} className={cn(buttonVariants({ size: "lg" }), "hidden sm:inline-flex")}>
          기록 입력하기
        </Link>
      </div>

      <Stats stats={stats} />

      <RecentRecords records={records} roleHref={roleHref} />
      <GuardianConnections residents={residents} guardians={guardians} />

      <Card>
        <CardHeader>
          <CardTitle>운영 통계</CardTitle>
          <Badge variant="pro">PRO</Badge>
          <CardDescription className="w-full">어르신별 기록 수</CardDescription>
        </CardHeader>
        <CardContent>
          <PlanGate feature="statistics" title="운영 통계는 Pro에서 볼 수 있어요">
            <ResidentChart residents={residents} records={records} />
          </PlanGate>
        </CardContent>
      </Card>

      {/* 데모용: Free/Pro 화면을 오가며 확인하기 위한 스위치. 실제 서비스에서는 결제 흐름으로 대체한다. */}
      <p className="py-4 text-center text-muted-foreground">
        데모 요금제: {isPro ? "Pro" : "Free"} ·{" "}
        <button
          type="button"
          className="font-semibold underline underline-offset-4 hover:text-foreground"
          onClick={() =>
            isPro
              ? setPlan.mutate("free", { onSuccess: () => track("plan_changed", { to: "free" }) })
              : upgrade("demo_switch")
          }
        >
          {isPro ? "Free로 전환" : "Pro로 전환"}
        </button>
      </p>
    </div>
  );
}

type StatItem = {
  label: string;
  value: number;
  unit: string;
  hint?: string;
  tone: "khaki" | "orange" | "wood" | "walnut";
};

// 지표 숫자 색. 카키·오렌지·브라운·짙은 브라운을 하나씩 나눠 쓴다.
const TONE_TEXT: Record<StatItem["tone"], string> = {
  khaki: "text-primary-strong",
  orange: "text-accent",
  wood: "text-wood",
  walnut: "text-wood-dark",
};

// 누를 수 없는 지표이므로 배경 없이 큰 글씨로만 보여 준다.
function Stats({ stats }: { stats: StatItem[] }) {
  return (
    // 원장 여부에 따라 칸 수(2~3개)가 달라져도 칸 너비가 같도록 데스크톱은 4열 격자를 유지한다
    <dl className="grid grid-cols-2 gap-y-8 py-2 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col px-1 md:border-l-2 md:border-border md:px-6 md:first:border-l-0 md:first:pl-1">
          <dt className="text-lg font-bold text-muted-foreground">{stat.label}</dt>
          <dd className="mt-2">
            <span className={cn("flex items-baseline", TONE_TEXT[stat.tone])}>
              <span className="text-5xl font-extrabold tracking-[-0.04em] tabular-nums md:text-6xl">
                {stat.value}
              </span>
              <span className="ml-1 text-xl font-bold">{stat.unit}</span>
            </span>
            {stat.hint && <span className="mt-1 block text-base font-semibold text-muted-foreground">{stat.hint}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// 모바일은 누르기 쉬운 목록, 태블릿·데스크톱(sm 이상)은 표로 보여 준다. 어느 폭에서도 가로 스크롤이 생기지 않는다.
function RecentRecords({ records, roleHref }: { records: RecordSummary[]; roleHref: (path: string) => string }) {
  const rows = records.slice(0, 6).map((r) => {
    const notice = r.outputs.find((o) => o.type === "guardian_notice");
    // 아직 보내지 않은 알림장이 있는 기록은 행 전체를 연한 주황으로 눈에 띄게 한다
    return { ...r, notice, unsent: !!notice && notice.status !== "sent" };
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 기록</CardTitle>
        <CardDescription>{records.length}건</CardDescription>
      </CardHeader>
      <CardContent className="px-3 md:px-4">
        {rows.length === 0 ? (
          <p className="px-3 text-lg text-muted-foreground">아직 기록이 없습니다.</p>
        ) : (
          <>
            <ul className="flex flex-col gap-2 sm:hidden">
              {rows.map((r) => (
                <li key={r.id}>
                  <Link
                    href={roleHref(`/records/${r.id}/review`)}
                    className={cn(
                      "flex min-h-20 items-center gap-3 rounded-2xl px-4 py-3",
                      r.unsent ? "bg-accent-soft" : "bg-muted active:bg-muted-strong",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-xl font-extrabold">{r.resident.name}</span>
                      {/* 줄이 바뀌어야 하면 날짜와 시각 사이에서만 바뀌도록 묶는다 */}
                      <span className="mt-0.5 block text-base text-muted-foreground tabular-nums">
                        <span className="whitespace-nowrap">{formatDay(r.createdAt)}</span>{" "}
                        <span className="whitespace-nowrap">{formatTime(r.createdAt)}</span>
                      </span>
                    </span>
                    {/* 상태는 행의 세로 가운데, 화살표 옆에 둔다 */}
                    <NoticeStatus notice={r.notice} />
                    <ChevronRight className="size-6 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>

            <table className="hidden w-full border-separate border-spacing-0 sm:table">
              <thead>
                <tr>
                  <th className={cn(th, "rounded-l-2xl")}>작성 시각</th>
                  <th className={th}>어르신</th>
                  <th className={th}>기록 내용</th>
                  <th className={th}>알림장</th>
                  <th className={cn(th, "w-20 rounded-r-2xl")}>
                    <span className="sr-only">열기</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className={cn(
                      "[&>td]:border-b [&>td]:border-border last:[&>td]:border-b-0",
                      r.unsent ? "bg-accent-soft" : "hover:bg-muted/60",
                    )}
                  >
                    <td className={cn(td, "whitespace-nowrap text-muted-foreground tabular-nums")}>
                      {formatDateTime(r.createdAt)}
                    </td>
                    <td className={cn(td, "text-lg font-bold whitespace-nowrap")}>{r.resident.name}</td>
                    <td className={cn(td, "w-full max-w-0 truncate text-subtle-foreground")}>{r.text}</td>
                    <td className={td}>
                      <NoticeStatus notice={r.notice} />
                    </td>
                    <td className={cn(td, "text-right")}>
                      <Link
                        href={roleHref(`/records/${r.id}/review`)}
                        className="inline-flex h-11 items-center rounded-full px-3 font-bold text-wood hover:bg-wood-soft"
                      >
                        열기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function GuardianConnections({ residents, guardians }: { residents: Resident[]; guardians: Guardian[] }) {
  const [invited, setInvited] = useState<string[]>([]);

  const rows = residents.map((r) => {
    const gs = r.guardianIds.map((id) => guardians.find((g) => g.id === id)).filter((g) => !!g);
    const joined = gs.find((g) => g.joined);
    const pending = gs.find((g) => !g.joined);
    return { resident: r, joined, pending, guardian: joined ?? pending, isInvited: invited.includes(r.id) };
  });
  type Row = (typeof rows)[number];

  const status = ({ joined, pending, isInvited }: Row) =>
    joined ? (
      <Badge variant="success">연결됨</Badge>
    ) : isInvited ? (
      <Badge variant="primary">초대 발송</Badge>
    ) : pending ? (
      <Badge variant="warning">가입 대기</Badge>
    ) : (
      <Badge>보호자 미등록</Badge>
    );

  const action = ({ resident, joined, pending, isInvited }: Row) =>
    !joined &&
    !isInvited && (
      <Button
        size="sm"
        // 처음 초대는 채운 버튼, 이미 초대한 보호자에게 다시 보내기는 테두리 버튼으로 구분한다
        variant={pending ? "line" : "secondary"}
        onClick={() => {
          // PoC: 실제 초대 문자 발송 없이 상태만 바꾼다.
          setInvited((v) => [...v, resident.id]);
        }}
      >
        {pending ? "다시 보내기" : "초대하기"}
      </Button>
    );

  // 보호자가 없으면 상태 칸에 "보호자 미등록"이 나오므로 여기서는 비운다
  const guardianText = ({ guardian }: Row) => (guardian ? `${guardian.name} (${guardian.relation})` : "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>보호자 연결</CardTitle>
      </CardHeader>
      <CardContent className="px-3 md:px-4">
        <ul className="flex flex-col gap-2 sm:hidden">
          {rows.map((row) => (
            <li key={row.resident.id} className="flex flex-col gap-3 rounded-2xl bg-muted px-4 py-4">
              <div className="flex items-start gap-3">
                <span className="min-w-0 flex-1">
                  <span className="block text-xl font-extrabold">{row.resident.name}</span>
                  {row.guardian && <span className="block text-base text-muted-foreground">{guardianText(row)}</span>}
                </span>
                {status(row)}
              </div>
              {action(row)}
            </li>
          ))}
        </ul>

        <table className="hidden w-full border-separate border-spacing-0 sm:table">
          <thead>
            <tr>
              <th className={cn(th, "rounded-l-2xl")}>어르신</th>
              <th className={th}>호실</th>
              <th className={th}>보호자</th>
              <th className={th}>상태</th>
              <th className={cn(th, "rounded-r-2xl")}>
                <span className="sr-only">작업</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.resident.id} className="[&>td]:border-b [&>td]:border-border last:[&>td]:border-b-0">
                <td className={cn(td, "text-lg font-bold whitespace-nowrap")}>{row.resident.name}</td>
                <td className={cn(td, "text-muted-foreground")}>{row.resident.room}</td>
                <td className={td}>{guardianText(row) || <span className="text-muted-foreground">-</span>}</td>
                <td className={td}>{status(row)}</td>
                <td className={cn(td, "text-right")}>{action(row)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function ResidentChart({ residents, records }: { residents: Resident[]; records: RecordSummary[] }) {
  const counts = residents.map((r) => ({
    resident: r,
    count: records.filter((x) => x.residentId === r.id).length,
  }));
  const max = Math.max(1, ...counts.map((c) => c.count));
  return (
    <ul className="flex flex-col gap-3">
      {counts.map(({ resident, count }, i) => (
        <li key={resident.id} className="grid grid-cols-[5rem_1fr_3rem] items-center gap-3">
          <span className="font-medium">{resident.name}</span>
          <div className="h-3 overflow-hidden rounded-sm bg-muted">
            <div className={cn("h-full", BAR_COLORS[i % BAR_COLORS.length])} style={{ width: `${(count / max) * 100}%` }} />
          </div>
          <span className="text-right text-sm text-muted-foreground tabular-nums">{count}건</span>
        </li>
      ))}
    </ul>
  );
}
