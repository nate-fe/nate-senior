"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cardClass } from "@/components/ui/card";
import { FieldError } from "@/components/ui/input";
import { track } from "@/features/analytics/track";
import type { GuardianFeedItem } from "@/lib/api";
import { useAddReply, useGuardian, useGuardianFeed, useMarkNoticeRead, useUpdateConsents } from "@/lib/queries";
import { cn, formatDateTime } from "@/lib/utils";
import { DEMO_GUARDIAN_ID } from "@/mocks/seed";

export default function GuardianPage() {
  const guardianId = DEMO_GUARDIAN_ID;
  const { data: guardian } = useGuardian(guardianId);
  const { data: feed, isPending } = useGuardianFeed(guardianId);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-wood-dark px-4 text-wood-dark-foreground">
        <h1 className="flex items-center gap-2 text-lg font-bold text-white">
          <span aria-hidden className="size-2.5 rounded-[3px] bg-accent-on-dark" />
          알림장
        </h1>
        <span className="text-sm text-wood-dark-muted">{guardian ? `${guardian.name}님` : ""}</span>
      </header>

      <main className="flex flex-col gap-4 px-4 pt-4 pb-10">
        {isPending ? (
          <p className="p-6 text-muted-foreground">불러오는 중…</p>
        ) : feed?.length === 0 ? (
          <p className={cn(cardClass, "p-10 text-center text-lg text-muted-foreground")}>아직 도착한 알림장이 없습니다.</p>
        ) : (
          feed?.map((item) => <NoticeItem key={item.output.id} item={item} guardianId={guardianId} />)
        )}

        <ConsentSection guardianId={guardianId} />
      </main>
    </div>
  );
}

function NoticeItem({ item, guardianId }: { item: GuardianFeedItem; guardianId: string }) {
  const [text, setText] = useState("");
  const addReply = useAddReply(guardianId);
  const { mutate: markRead } = useMarkNoticeRead();
  const { output, record, resident, replies } = item;

  // 보호자가 알림장을 보면 읽음으로 남겨 요양보호사 화면에 "보호자 확인"으로 보이게 한다.
  useEffect(() => {
    track("guardian_notice_viewed", { outputId: output.id });
    if (!output.readAt) markRead(output.id);
  }, [output.id, output.readAt, markRead]);

  const date = new Date(output.updatedAt).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <article className={cn(cardClass, "overflow-hidden")}>
      <div className="px-5 pt-5">
        <p className="text-sm text-muted-foreground">햇살요양원 · {resident.name} 어르신</p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.03em]">{date}</h2>
      </div>

      <p className="px-5 py-4 text-lg leading-relaxed whitespace-pre-wrap">{output.content}</p>

      {record.photos.length > 0 && (
        <div className="grid grid-cols-2 gap-0.5">
          {record.photos.map((src, i) => (
            <div key={i} className="relative aspect-square">
              <Image src={src} alt={`${resident.name} 어르신 사진 ${i + 1}`} fill unoptimized className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-border px-5 py-4">
        <p className="mb-3 text-sm font-semibold text-wood">답글 {replies.length}</p>
        {replies.length > 0 && (
          <ul className="mb-4 flex flex-col gap-3">
            {replies.map((r) => (
              <li key={r.id}>
                <p className="text-sm">
                  <span className="font-semibold">나</span>
                  <span className="ml-2 text-muted-foreground">{formatDateTime(r.createdAt)}</span>
                </p>
                <p className="mt-0.5">{r.text}</p>
              </li>
            ))}
          </ul>
        )}

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const value = text.trim();
            if (!value) return;
            addReply.mutate(
              { outputId: output.id, text: value },
              {
                onSuccess: () => {
                  setText("");
                  track("guardian_reply_sent", { outputId: output.id });
                },
              },
            );
          }}
        >
          <label htmlFor={`reply-${output.id}`} className="sr-only">
            기관에 답글 남기기
          </label>
          <input
            id={`reply-${output.id}`}
            className="h-14 min-w-0 flex-1 rounded-full bg-wood-soft px-5 placeholder:text-placeholder focus:outline-2 focus:outline-primary"
            placeholder="기관에 답글 남기기"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            disabled={!text.trim() || addReply.isPending}
            className="h-14 shrink-0 rounded-full bg-primary px-6 font-bold text-white disabled:bg-muted-strong disabled:text-placeholder"
          >
            등록
          </button>
        </form>
        <FieldError message={addReply.error?.message} />
      </div>
    </article>
  );
}

// 돌봄 기록은 민감정보일 수 있어, 추천·검증 활용은 별도 동의로 분리한다.
function ConsentSection({ guardianId }: { guardianId: string }) {
  const { data: guardian } = useGuardian(guardianId);
  const update = useUpdateConsents(guardianId);
  if (!guardian) return null;

  return (
    <section className={cn(cardClass, "overflow-hidden")}>
      <h2 className="px-5 pt-5 pb-2 text-lg font-extrabold">정보 활용 동의</h2>
      <ul className="divide-y divide-border">
        <SwitchRow
          label="알림장 받기"
          description="필수 · 기관이 보내는 하루 소식과 사진"
          checked={guardian.consents.notice}
          disabled
        />
        <SwitchRow
          label="맞춤 서비스 추천"
          description="선택 · 돌봄 기록을 바탕으로 전문가·서비스 추천. 언제든 끌 수 있습니다."
          checked={guardian.consents.dataForRecommendation}
          disabled={update.isPending}
          onChange={(v) => {
            update.mutate({ dataForRecommendation: v });
            track("guardian_consent_changed", { dataForRecommendation: v });
          }}
        />
      </ul>
    </section>
  );
}

function SwitchRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <li>
      <label className="flex min-h-16 cursor-pointer items-center gap-4 px-5 py-3 has-disabled:cursor-default">
        <span className="flex-1">
          <span className="block font-semibold">{label}</span>
          <span className="block text-sm text-muted-foreground">{description}</span>
        </span>
        <input
          type="checkbox"
          role="switch"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span
          aria-hidden
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary",
            checked ? "bg-primary" : "bg-muted-strong",
            disabled && "opacity-50",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform",
              checked && "translate-x-5",
            )}
          />
        </span>
      </label>
    </li>
  );
}
