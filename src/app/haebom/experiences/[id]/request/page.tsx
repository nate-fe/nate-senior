"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, CircleCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type ReactNode, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cardClass } from "@/components/ui/card";
import { FieldError, Input, Label, Textarea } from "@/components/ui/input";
import { type PurchaseRequestInput, purchaseRequestInputSchema } from "@/entities/haebom";
import { track } from "@/features/analytics/track";
import { CategoryBadge, SellerAvatar, ageGroup, formatPrice, maskName } from "@/features/haebom/ui";
import { useCreatePurchaseRequest, useExperience } from "@/lib/haebom-queries";
import { cn, formatDateKey } from "@/lib/utils";

// 경험 구매 신청. 결제·정산 방식이 정해지지 않아(기획서 154행) 신청만 받고, 판매자가 수락하면 연락한다.
export default function PurchaseRequestPage() {
  const { id } = useParams<{ id: string }>();
  const { data: e, isPending } = useExperience(id);
  const create = useCreatePurchaseRequest();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<PurchaseRequestInput>({
    resolver: zodResolver(purchaseRequestInputSchema),
    defaultValues: { experienceId: id, buyerName: "", phone: "", preferredDate: "", note: "" },
  });
  const preferredDate = useWatch({ control, name: "preferredDate" });
  const [today] = useState(() => new Date());
  const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 60);

  if (isPending || !e) return <p className="mx-auto max-w-2xl px-4 py-10 text-lg text-muted-foreground">불러오는 중…</p>;

  if (create.isSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
        <div role="status" className={cn(cardClass, "flex flex-col items-center gap-4 p-8 text-center md:p-10")}>
          <CircleCheck className="size-16 text-primary" />
          <h1 className="text-3xl font-extrabold tracking-[-0.04em]">신청했어요</h1>
          <p className="text-xl leading-relaxed text-subtle-foreground">
            <span className="font-bold text-foreground">{formatDateKey(create.data.preferredDate)}</span>로 신청했어요.
            <br />
            해본 분({maskName(e.seller.name)}님)이 확인하고
            <br />
            {create.data.phone}로 먼저 연락드려요.
          </p>
          <Link href="/haebom/experiences" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "mt-4 w-full")}>
            다른 경험 보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((input) =>
        create.mutate(input, {
          onSuccess: () => track("haebom_purchase_requested", { experienceId: input.experienceId, price: e.price }),
        }),
      )}
      className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pt-6 pb-16 md:px-6"
    >
      <Link
        href={`/haebom/experiences/${e.id}`}
        className="flex h-11 w-fit items-center gap-1 text-lg font-bold text-muted-foreground"
      >
        <ChevronLeft className="size-6" /> 경험 소개
      </Link>

      {/* 무엇을 신청하는지 요약 */}
      <section className={cn(cardClass, "p-6 md:p-7")}>
        <p className="text-base font-bold text-muted-foreground">신청할 경험</p>
        <h1 className="mt-1 text-2xl leading-snug font-extrabold tracking-[-0.03em]">{e.title}</h1>
        <p className="mt-2 text-lg text-primary-strong">
          {e.duration} · <span className="font-extrabold">{formatPrice(e.price)}</span>
        </p>

        {/* 신청 직전이라 판매자를 사진과 함께 보여 준다. 사진이 없으면 분야 아이콘으로 대신한다. */}
        <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
          {e.seller.photo ? (
            <SellerAvatar name={maskName(e.seller.name)} photo={e.seller.photo} />
          ) : (
            <CategoryBadge category={e.category} />
          )}
          <div className="min-w-0">
            <p className="text-lg font-extrabold">
              {maskName(e.seller.name)}{" "}
              <span className="text-base font-bold text-muted-foreground">{ageGroup(e.seller.age)}</span>
            </p>
            <p className="text-base text-primary-strong">{e.seller.background}</p>
          </div>
        </div>
      </section>

      <section className={cn(cardClass, "flex flex-col gap-5 p-6 md:p-7")}>
        <Field id="buyerName" label="성함" error={errors.buyerName?.message}>
          <Input id="buyerName" aria-invalid={!!errors.buyerName} {...register("buyerName")} />
        </Field>
        <Field id="phone" label="연락받을 전화번호" error={errors.phone?.message}>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            placeholder="010-1234-5678"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </Field>

        <fieldset>
          <legend className="mb-2 text-lg font-bold">원하는 날짜</legend>
          {/* 오늘부터 60일 안에서 고른다 */}
          <Calendar
            value={preferredDate}
            onChange={(key) => setValue("preferredDate", key, { shouldValidate: true })}
            min={today}
            max={maxDate}
          />
          <p className="mt-3 text-lg font-bold" aria-live="polite">
            {preferredDate ? (
              <span className="text-primary-strong">{formatDateKey(preferredDate)}</span>
            ) : (
              <span className="text-muted-foreground">날짜를 눌러 골라 주세요</span>
            )}
          </p>
          <FieldError message={errors.preferredDate?.message} />
        </fieldset>

        <Field id="note" label="부탁할 내용" error={errors.note?.message}>
          <Textarea
            id="note"
            rows={4}
            className="text-lg"
            placeholder="예) 이번 주말 수원에서 2019년식 SUV를 보기로 했어요."
            aria-invalid={!!errors.note}
            {...register("note")}
          />
        </Field>
      </section>

      <p className="px-1 text-base text-muted-foreground">
        고른 날짜에 가능한지 해본 분이 확인하고 연락드려요. 결제 방법은 약속이 정해진 뒤 안내해 드려요.
      </p>
      <FieldError message={create.error?.message} />
      <Button type="submit" size="lg" className="w-full text-xl" disabled={create.isPending}>
        {create.isPending ? "신청하는 중…" : `${formatPrice(e.price)} 경험 신청하기`}
      </Button>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-lg">
        {label}
      </Label>
      {children}
      <FieldError message={error} />
    </div>
  );
}
