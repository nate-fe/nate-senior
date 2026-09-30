"use client";

import { CircleCheck, Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldError, Textarea } from "@/components/ui/input";
import type { Output } from "@/entities";
import { track } from "@/features/analytics/track";
import { useRole } from "@/features/session/role";
import { useApproveOutput, useUpdateOutput } from "@/lib/queries";
import { formatDateTime } from "@/lib/utils";

// 요양보호사가 초안을 보고(필요하면 고쳐서) 한 번에 보낸다. 공단 문서만 담당자 확인 체크가 추가로 필요하다.
export function OutputEditor({ output, recordId }: { output: Output; recordId: string }) {
  const { staffName } = useRole();
  const [content, setContent] = useState(output.content);
  const [confirmed, setConfirmed] = useState(false);
  const update = useUpdateOutput(recordId);
  const approve = useApproveOutput();

  const done = output.status !== "draft";
  const dirty = content !== output.content;
  const needsOfficerCheck = output.type === "nhis_form";
  const isNotice = output.type === "guardian_notice";

  const handleSend = async () => {
    if (dirty) {
      await update.mutateAsync({ id: output.id, content });
      track("output_edited", { type: output.type });
    }
    await approve.mutateAsync({ id: output.id, reviewer: staffName });
    track("output_approved", { type: output.type, edited: dirty });
  };

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-2xl bg-wood-soft p-6 text-lg leading-relaxed whitespace-pre-wrap">{output.content}</p>
        {isNotice ? <ReadState output={output} /> : (
          <p className="text-base text-muted-foreground">{formatDateTime(output.updatedAt)} 저장했어요</p>
        )}
      </div>
    );
  }

  const error = update.error ?? approve.error;

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        aria-label="보낼 내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={12}
        className="text-lg"
      />
      {needsOfficerCheck && (
        <label className="flex min-h-16 cursor-pointer items-center gap-4 rounded-2xl bg-accent-soft px-5 py-4">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="size-7 shrink-0 accent-primary"
          />
          <span className="text-lg font-bold">공단 제출 담당자가 내용을 확인했습니다</span>
        </label>
      )}
      <FieldError message={error?.message} />
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {dirty && (
          <Button variant="ghost" size="lg" onClick={() => setContent(output.content)}>
            고친 내용 되돌리기
          </Button>
        )}
        <Button
          size="lg"
          className="w-full text-xl sm:w-auto"
          onClick={handleSend}
          disabled={update.isPending || approve.isPending || (needsOfficerCheck && !confirmed)}
        >
          {isNotice ? "보호자에게 보내기" : "저장하기"}
        </Button>
      </div>
    </div>
  );
}

// 보낸 알림장을 보호자가 읽었는지 보여 준다.
function ReadState({ output }: { output: Output }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border-2 border-border p-5">
      <p className="text-base text-muted-foreground">{formatDateTime(output.updatedAt)} 보냈어요</p>
      {output.readAt ? (
        <p className="flex items-center gap-2 text-lg font-bold text-success">
          <CircleCheck className="size-6" />
          보호자가 확인했어요
          <span className="text-base font-medium text-muted-foreground">{formatDateTime(output.readAt)}</span>
        </p>
      ) : (
        <p className="flex items-center gap-2 text-lg font-bold text-pending">
          <Clock className="size-6" />
          보호자가 아직 확인하지 않았어요
        </p>
      )}
    </div>
  );
}
