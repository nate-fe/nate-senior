"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Check, LoaderCircle, Mic, Square, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldError, Label, Textarea } from "@/components/ui/input";
import { type RecordInput, recordInputSchema } from "@/entities";
import { track } from "@/features/analytics/track";
import { useRole } from "@/features/session/role";
import { useSpeech } from "@/features/voice/use-speech";
import { useCreateRecord, useResidents } from "@/lib/queries";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 4;

export default function NewRecordPage() {
  const router = useRouter();
  const { staffName, href: roleHref } = useRole();
  const { data: residents, isPending } = useResidents();
  const createRecord = useCreateRecord();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<RecordInput>({
    resolver: zodResolver(recordInputSchema),
    defaultValues: { residentId: "", text: "", source: "text", photos: [] },
  });

  const residentId = useWatch({ control, name: "residentId" });
  const photos = useWatch({ control, name: "photos" });

  useEffect(() => track("record_started"), []);

  const speech = useSpeech((finalText) => {
    const prev = getValues("text");
    setValue("text", prev ? `${prev} ${finalText}` : finalText, { shouldValidate: true });
    setValue("source", "voice");
  });

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const room = MAX_PHOTOS - getValues("photos").length;
    for (const file of Array.from(files).slice(0, room)) {
      const reader = new FileReader();
      reader.onload = () => {
        setValue("photos", [...getValues("photos"), reader.result as string]);
        track("record_photo_added");
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = handleSubmit((input) => {
    speech.stop();
    createRecord.mutate(
      { input, authorName: staffName },
      {
        onSuccess: (record) => {
          track("record_submitted", { source: input.source, photoCount: input.photos.length, length: input.text.length });
          router.push(roleHref(`/records/${record.id}/review`));
        },
      },
    );
  });

  if (createRecord.isPending) {
    return (
      <div role="status" className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <LoaderCircle className="size-14 animate-spin text-primary" />
        <p className="text-2xl font-extrabold tracking-[-0.03em]">문서를 만들고 있어요</p>
        <p className="text-lg text-muted-foreground">잠시만 기다려 주세요</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto flex max-w-xl flex-col gap-4 pb-32 lg:pb-28">
      <h1 className="mb-2 text-3xl font-extrabold tracking-[-0.04em] md:text-4xl">기록 입력</h1>

      {/* 1. 어르신 선택 */}
      <Card className="p-5 md:p-6">
        <fieldset>
          <legend className="mb-4">
            <StepTitle no={1}>어르신을 골라 주세요</StepTitle>
          </legend>
          {isPending ? (
            <p className="text-lg text-muted-foreground">불러오는 중…</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {residents?.map((r) => {
                const selected = residentId === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setValue("residentId", r.id, { shouldValidate: true })}
                    className={cn(
                      "flex min-h-20 items-center gap-4 rounded-2xl border-2 px-5 text-left transition-colors",
                      selected ? "border-primary bg-primary-soft" : "border-border hover:bg-muted",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full border-2",
                        selected ? "border-primary bg-primary" : "border-border-strong",
                      )}
                    >
                      {selected && <Check className="size-4 stroke-[3] text-white" />}
                    </span>
                    <span className="flex-1">
                      <span className="block text-xl font-extrabold">{r.name}</span>
                      <span className="block text-base text-muted-foreground">
                        {r.room} · {r.careGrade}등급
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          <div className="mt-3">
            <FieldError message={errors.residentId?.message} />
          </div>
        </fieldset>
      </Card>

      {/* 2. 기록 */}
      <Card className="flex flex-col gap-4 p-5 md:p-6">
        <Label htmlFor="text">
          <StepTitle no={2}>오늘 있었던 일을 적어 주세요</StepTitle>
        </Label>
        {speech.supported && (
          <Button
            type="button"
            size="lg"
            variant={speech.listening ? "outline" : "secondary"}
            onClick={() => {
              if (speech.listening) return speech.stop();
              track("record_voice_used");
              speech.start();
            }}
            className={cn("w-full", speech.listening && "border-danger text-danger")}
          >
            {speech.listening ? (
              <>
                <Square /> 말하기 끝내기
              </>
            ) : (
              <>
                <Mic /> 말로 입력하기
              </>
            )}
          </Button>
        )}
        {speech.listening && (
          <p className="rounded-2xl bg-accent-soft px-5 py-4 text-lg font-semibold text-accent-strong" aria-live="polite">
            듣고 있어요… {speech.interim}
          </p>
        )}
        {speech.error && <FieldError message={speech.error} />}
        <Textarea
          id="text"
          rows={5}
          placeholder="예) 점심 반 정도 드심. 노래교실 참여, 웃으심. 산책 20분."
          aria-invalid={!!errors.text}
          className="text-xl leading-relaxed"
          {...register("text")}
        />
        <FieldError message={errors.text?.message} />
      </Card>

      {/* 3. 사진 */}
      <Card className="flex flex-col gap-4 p-5 md:p-6">
        <div>
          <StepTitle no={3}>사진을 붙여 주세요</StepTitle>
          <p className="mt-1 text-base text-muted-foreground">안 붙여도 괜찮아요 · 최대 {MAX_PHOTOS}장</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((src, i) => (
            <div key={src.slice(-32) + i} className="relative aspect-square overflow-hidden rounded-2xl">
              <Image src={src} alt={`첨부 사진 ${i + 1}`} fill unoptimized className="object-cover" />
              <button
                type="button"
                aria-label={`사진 ${i + 1} 삭제`}
                onClick={() => setValue("photos", photos.filter((_, j) => j !== i))}
                className="absolute top-2 right-2 flex size-11 items-center justify-center rounded-full bg-black/65 text-white"
              >
                <X className="size-6" />
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-wood/40 bg-wood-soft text-wood-strong hover:bg-wood-soft-hover">
              <Camera className="size-9" />
              <span className="text-base font-bold">사진 추가</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="sr-only"
                onChange={(e) => {
                  addPhotos(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>
      </Card>

      {/* 하단 고정 제출 버튼: 모바일에서는 하단 탭 바 바로 위에 둔다 */}
      <div className="fixed inset-x-0 bottom-[4.5rem] z-20 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur lg:bottom-0 lg:left-64 lg:py-4">
        <div className="mx-auto max-w-xl">
          <Button type="submit" size="lg" className="w-full text-xl">
            저장하고 문서 만들기
          </Button>
          {createRecord.isError && <FieldError message={createRecord.error.message} />}
        </div>
      </div>
    </form>
  );
}

function StepTitle({ no, children }: { no: number; children: ReactNode }) {
  return (
    <span className="flex items-center gap-3 text-xl font-extrabold tracking-[-0.03em] text-foreground">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-lg text-white">
        {no}
      </span>
      {children}
    </span>
  );
}
