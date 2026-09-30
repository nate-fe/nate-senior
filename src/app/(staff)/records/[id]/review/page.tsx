"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { OUTPUT_META, OUTPUT_TYPES, type OutputType } from "@/entities";
import { track } from "@/features/analytics/track";
import { PlanGate, usePlan } from "@/features/plan-gate";
import { useRole } from "@/features/session/role";
import { useRecord } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { OriginalRecordButton } from "./original-record-dialog";
import { OutputEditor } from "./output-editor";

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending, isError, error } = useRecord(id);
  const { can } = usePlan();
  const { href: roleHref } = useRole();
  const [active, setActive] = useState<OutputType>("guardian_notice");

  useEffect(() => {
    track("output_viewed", { recordId: id, type: active });
  }, [id, active]);

  if (isPending) return <p className="text-muted-foreground">불러오는 중…</p>;
  if (isError) return <p className="text-danger">{error.message}</p>;

  const { resident, outputs } = data;
  const output = outputs.find((o) => o.type === active);
  const meta = OUTPUT_META[active];

  return (
    <div className="flex flex-col gap-4">
      <nav aria-label="현재 위치" className="flex items-center gap-1 text-base font-semibold text-muted-foreground">
        <Link href={roleHref("/dashboard")} className="hover:text-foreground">
          홈
        </Link>
        <ChevronRight className="size-4" />
        <span>문서 보내기</span>
      </nav>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold tracking-[-0.04em] md:text-4xl">{resident.name} 어르신 기록</h1>
        <OriginalRecordButton record={data} />
      </div>

      {/* 결과물 4종 */}
      <Card className="min-w-0">
        {/* 탭은 가로 스크롤 대신 모바일 2열, 넓은 화면 4열로 배치한다 */}
        <div role="tablist" aria-label="결과물 종류" className="grid grid-cols-2 border-b border-border px-3 sm:grid-cols-4">
          {OUTPUT_TYPES.map((t) => {
            const m = OUTPUT_META[t];
            const locked = m.plan === "pro" && !can("aiDocuments");
            const selected = active === t;
            return (
              <button
                key={t}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => setActive(t)}
                className={cn(
                  "-mb-px flex min-h-16 min-w-0 items-center justify-center gap-2 border-b-[3px] px-2 py-2 text-center text-lg leading-snug font-bold",
                  selected
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {m.label}
                {locked && (
                  <Badge variant="pro" className="h-6 px-2 text-xs">
                    PRO
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="p-6 md:p-7">
          {!output ? (
            <p className="text-lg text-muted-foreground">이 기록에는 아직 결과물이 없습니다.</p>
          ) : meta.plan === "pro" ? (
            <PlanGate feature="aiDocuments" title={`${meta.label} 초안이 준비되어 있어요`}>
              <OutputEditor key={output.id + output.updatedAt} output={output} recordId={id} />
            </PlanGate>
          ) : (
            <OutputEditor key={output.id + output.updatedAt} output={output} recordId={id} />
          )}
        </div>
      </Card>
    </div>
  );
}
