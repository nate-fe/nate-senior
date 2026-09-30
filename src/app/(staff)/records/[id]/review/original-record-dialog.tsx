"use client";

import { FileText, X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import type { RecordSummary } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";

// 요양보호사가 처음 남긴 원본 기록. 평소에는 보낸 문서가 중요하므로 버튼을 눌렀을 때만 레이어로 띄운다.
// 브라우저 기본 <dialog>를 써서 Esc로 닫기·포커스 이동·배경 어둡게를 그대로 쓴다.
export function OriginalRecordButton({ record }: { record: RecordSummary }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <Button variant="secondary" onClick={() => dialogRef.current?.showModal()}>
        <FileText />
        원본 기록
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby="original-record-title"
        // 배경(다이얼로그 바깥)을 누르면 닫는다
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-0 mt-auto max-h-[85vh] w-full max-w-none overflow-y-auto rounded-t-3xl bg-surface p-0 text-foreground backdrop:bg-black/45 sm:m-auto sm:max-w-lg sm:rounded-3xl"
      >
        <div className="flex flex-col gap-5 p-6 md:p-7">
          <div className="flex items-center justify-between gap-3">
            <h2 id="original-record-title" className="text-2xl font-extrabold tracking-[-0.03em]">
              원본 기록
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="닫기"
              className="flex size-12 items-center justify-center rounded-full hover:bg-muted"
            >
              <X className="size-7" />
            </button>
          </div>

          <p className="text-xl leading-relaxed whitespace-pre-wrap">{record.text}</p>

          {record.photos.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {record.photos.map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image src={src} alt={`기록 사진 ${i + 1}`} fill unoptimized className="object-cover" />
                </div>
              ))}
            </div>
          )}

          <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5 rounded-2xl bg-wood-soft p-5 text-lg">
            <dt className="text-muted-foreground">작성자</dt>
            <dd>{record.authorName}</dd>
            <dt className="text-muted-foreground">작성 시각</dt>
            <dd>{formatDateTime(record.createdAt)}</dd>
            <dt className="text-muted-foreground">호실</dt>
            <dd>{record.resident.room}</dd>
            <dt className="text-muted-foreground">요양등급</dt>
            <dd>{record.resident.careGrade}등급</dd>
          </dl>

          <Button size="lg" variant="outline" onClick={close} className="w-full">
            닫기
          </Button>
        </div>
      </dialog>
    </>
  );
}
