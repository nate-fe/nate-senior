import { z } from "zod";

// 데이터 모델: Institution(요금제) → Resident → Record(원본 입력) → Output 4종, 그리고 Guardian.

export const planSchema = z.enum(["free", "pro"]);
export type Plan = z.infer<typeof planSchema>;

export const institutionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["nursing_home", "day_care", "home_care"]),
  plan: planSchema,
});
export type Institution = z.infer<typeof institutionSchema>;

export const residentSchema = z.object({
  id: z.string(),
  institutionId: z.string(),
  name: z.string(),
  age: z.number(),
  room: z.string(),
  careGrade: z.number().min(1).max(5),
  guardianIds: z.array(z.string()),
});
export type Resident = z.infer<typeof residentSchema>;

// 보호자 계정은 특정 기관에 종속되지 않는다(2단계 가족 Care 대비). 기관과의 관계는 Resident를 통해서만 맺는다.
export const guardianSchema = z.object({
  id: z.string(),
  name: z.string(),
  relation: z.string(),
  phone: z.string(),
  joined: z.boolean(),
  consents: z.object({
    // 알림장 수신은 서비스 이용의 기본 동의
    notice: z.boolean(),
    // 돌봄 기록을 추천·현장 검증(3단계)에 활용하는 것에 대한 별도 동의
    dataForRecommendation: z.boolean(),
  }),
});
export type Guardian = z.infer<typeof guardianSchema>;

export const recordInputSchema = z.object({
  residentId: z.string().min(1, "어르신을 선택해 주세요"),
  text: z.string().trim().min(5, "기록을 5자 이상 입력해 주세요"),
  source: z.enum(["text", "voice"]),
  photos: z.array(z.string()),
});
export type RecordInput = z.infer<typeof recordInputSchema>;

export const careRecordSchema = recordInputSchema.extend({
  id: z.string(),
  authorName: z.string(),
  createdAt: z.string(),
});
export type CareRecord = z.infer<typeof careRecordSchema>;

export const outputTypeSchema = z.enum(["guardian_notice", "counsel_log", "monthly_report", "nhis_form"]);
export type OutputType = z.infer<typeof outputTypeSchema>;

export const outputStatusSchema = z.enum(["draft", "approved", "sent"]);
export type OutputStatus = z.infer<typeof outputStatusSchema>;

export const outputSchema = z.object({
  id: z.string(),
  recordId: z.string(),
  type: outputTypeSchema,
  content: z.string(),
  status: outputStatusSchema,
  reviewedBy: z.string().optional(),
  updatedAt: z.string(),
  // 보호자 알림장을 보호자가 처음 열어 본 시각
  readAt: z.string().optional(),
});
export type Output = z.infer<typeof outputSchema>;

export const guardianReplySchema = z.object({
  id: z.string(),
  outputId: z.string(),
  guardianId: z.string(),
  text: z.string(),
  createdAt: z.string(),
});
export type GuardianReply = z.infer<typeof guardianReplySchema>;

export const OUTPUT_META: Record<
  OutputType,
  { label: string; audience: string; plan: Plan; description: string }
> = {
  guardian_notice: {
    label: "보호자 알림장",
    audience: "보호자",
    plan: "free",
    description: "따뜻한 말투의 하루 소식 + 사진",
  },
  counsel_log: {
    label: "상담 · 활동 기록",
    audience: "사회복지사",
    plan: "pro",
    description: "관찰 중심 항목별 기록",
  },
  monthly_report: {
    label: "월간 활동보고서",
    audience: "센터 내부",
    plan: "pro",
    description: "한 달 기록 집계",
  },
  nhis_form: {
    label: "공단 제출 문서",
    audience: "국민건강보험공단",
    plan: "pro",
    description: "공식 제출 양식 · 담당자 확인 필수",
  },
};

export const OUTPUT_TYPES = outputTypeSchema.options;
