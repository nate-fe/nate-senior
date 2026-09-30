"use client";

import { type ReactNode, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/entities";
import { track } from "@/features/analytics/track";
import { useInstitution, useSetPlan } from "@/lib/queries";
import { cn } from "@/lib/utils";

// 요금제별 기능 목록. 어떤 기능이 Pro인지는 여기서만 정한다.
export const FEATURES = {
  guardianNotice: "free",
  guardianInvite: "free",
  photoShare: "free",
  aiDocuments: "pro",
  monthlyReport: "pro",
  recordSearch: "pro",
  customTemplates: "pro",
  statistics: "pro",
} as const satisfies Record<string, Plan>;

export type Feature = keyof typeof FEATURES;

export function canUse(plan: Plan, feature: Feature) {
  return FEATURES[feature] === "free" || plan === "pro";
}

export function usePlan() {
  const { data } = useInstitution();
  const plan: Plan = data?.plan ?? "free";
  return { plan, isPro: plan === "pro", can: (f: Feature) => canUse(plan, f) };
}

// 잠긴 기능은 숨기지 않고 앞부분만 보여 준다. "이미 만들어져 있다"는 걸 보여 주는 것이 결제 이유가 된다.
export function PlanGate({
  feature,
  children,
  title = "Pro 요금제에서 사용할 수 있어요",
  description,
  className,
}: {
  feature: Feature;
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}) {
  const { can } = usePlan();
  const allowed = can(feature);

  useEffect(() => {
    if (!allowed) track("upgrade_prompt_viewed", { feature });
  }, [allowed, feature]);

  if (allowed) return <>{children}</>;

  return (
    <div className={className}>
      <div aria-hidden className="pointer-events-none relative max-h-44 overflow-hidden select-none">
        {children}
        <div className="absolute inset-0 bg-linear-to-b from-surface/0 via-surface/80 to-surface" />
      </div>
      <UpgradeCard title={title} description={description} feature={feature} />
    </div>
  );
}

export function UpgradeCard({
  title = "Pro로 서류 업무를 줄여 보세요",
  description = "상담기록, 월간보고서, 공단 제출 문서 초안을 기록 한 번으로 함께 받아볼 수 있습니다.",
  feature,
  className,
}: {
  title?: string;
  description?: string;
  feature?: Feature;
  className?: string;
}) {
  const setPlan = useSetPlan();
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-3xl bg-wood-soft p-6 sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="flex-1">
        <Badge variant="pro">PRO</Badge>
        <p className="mt-3 text-lg font-extrabold">{title}</p>
        <p className="mt-1 text-base text-subtle-foreground">{description}</p>
      </div>
      <Button
        variant="pro"
        disabled={setPlan.isPending}
        onClick={() => {
          track("upgrade_clicked", { feature });
          // PoC: 결제 연동 전이므로 바로 Pro로 전환한다.
          setPlan.mutate("pro", { onSuccess: () => track("plan_changed", { to: "pro" }) });
        }}
      >
        Pro 시작하기
      </Button>
    </div>
  );
}
