"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/input";
import { track } from "@/features/analytics/track";
import { useSubmitInquiry } from "@/lib/queries";

const inquirySchema = z.object({
  institutionName: z.string().trim().min(2, "기관명을 입력해 주세요"),
  contactName: z.string().trim().min(2, "담당자 성함을 입력해 주세요"),
  phone: z.string().regex(/^0\d{1,2}-?\d{3,4}-?\d{4}$/, "연락처 형식을 확인해 주세요 (예: 010-1234-5678)"),
  residentCount: z.coerce.number<string>().int().min(1, "어르신 수를 입력해 주세요"),
  message: z.string().optional(),
});

type InquiryFormValues = z.input<typeof inquirySchema>;
type InquiryValues = z.output<typeof inquirySchema>;

export function InquiryForm() {
  const submit = useSubmitInquiry();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryFormValues, unknown, InquiryValues>({ resolver: zodResolver(inquirySchema) });

  if (submit.isSuccess) {
    return (
      <div role="status" className="rounded-xl bg-background p-8">
        <p className="text-xl font-bold">문의가 접수되었습니다</p>
        <p className="mt-2 text-subtle-foreground">담당자가 영업일 기준 하루 안에 연락드리겠습니다.</p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) =>
        submit.mutate(values, {
          onSuccess: () => track("inquiry_submitted", { residentCount: values.residentCount }),
        }),
      )}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="institutionName" label="기관명" error={errors.institutionName?.message}>
          <Input id="institutionName" placeholder="햇살요양원" aria-invalid={!!errors.institutionName} {...register("institutionName")} />
        </Field>
        <Field id="contactName" label="담당자 성함" error={errors.contactName?.message}>
          <Input id="contactName" aria-invalid={!!errors.contactName} {...register("contactName")} />
        </Field>
        <Field id="phone" label="연락처" error={errors.phone?.message}>
          <Input id="phone" type="tel" inputMode="tel" placeholder="010-1234-5678" aria-invalid={!!errors.phone} {...register("phone")} />
        </Field>
        <Field id="residentCount" label="어르신 수" error={errors.residentCount?.message}>
          <Input id="residentCount" type="number" inputMode="numeric" min={1} aria-invalid={!!errors.residentCount} {...register("residentCount")} />
        </Field>
      </div>
      <Field id="message" label="문의 내용 (선택)">
        <Textarea id="message" placeholder="궁금한 점을 자유롭게 적어 주세요" {...register("message")} />
      </Field>
      <Button type="submit" size="lg" className="mt-2 rounded-full font-bold" disabled={submit.isPending}>
        {submit.isPending ? "접수 중…" : "도입 문의하기"}
      </Button>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      <FieldError message={error} />
    </div>
  );
}
