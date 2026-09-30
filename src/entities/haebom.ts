import { z } from "zod";

// 해봄: 시니어가 "실제로 해본 경험"을 상품으로 만들어 필요한 사람에게 파는 경험 마켓플레이스.
// 시니어는 판매자, 구매자는 나이와 관계없이 그 경험이 필요한 사람이다(business-spec.md 46~56행).

export const experienceCategorySchema = z.enum(["car", "home", "life", "career"]);
export type ExperienceCategory = z.infer<typeof experienceCategorySchema>;

// 기획서의 핵심 상품 예시 분야(60~65행)
export const EXPERIENCE_CATEGORIES: Record<ExperienceCategory, { label: string; example: string }> = {
  car: { label: "자동차", example: "중고차 구매 동행, 정비 상담" },
  home: { label: "주거", example: "부동산 계약 상담, 정리·수납" },
  life: { label: "생활", example: "요리, 레시피 코칭" },
  career: { label: "커리어", example: "퇴직·이직 상담, 실무 멘토링" },
};

// 제공 형태(기획서 표의 "제공 형태")
export const deliveryFormatSchema = z.enum(["accompany", "consult", "visit", "mentoring"]);
export type DeliveryFormat = z.infer<typeof deliveryFormatSchema>;
export const DELIVERY_FORMATS: Record<DeliveryFormat, string> = {
  accompany: "현장 동행",
  consult: "상담",
  visit: "방문 코칭",
  mentoring: "멘토링",
};

// 판매자(시니어). 경력 한 줄보다 "실제로 해본 경험"을 보여 주는 것이 핵심이다.
export const sellerSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  // 예) "자동차 정비 30년"
  background: z.string(),
  // 예) "정비소에서 중고차를 2,000대 넘게 봤어요"
  story: z.string(),
  // 프로필 사진(public 경로). 신청 직전 화면에서만 보여 주고, 없으면 분야 아이콘으로 대신한다.
  photo: z.string().optional(),
});
export type Seller = z.infer<typeof sellerSchema>;

export const experienceSchema = z.object({
  id: z.string(),
  sellerId: z.string(),
  category: experienceCategorySchema,
  title: z.string(),
  format: deliveryFormatSchema,
  // 예) "2시간"
  duration: z.string(),
  // 예) "서울·경기" / "전화·영상"
  area: z.string(),
  price: z.number(),
  // 이 경험을 사면 받는 것
  includes: z.array(z.string()),
  // 신뢰 장치(기획서 155행은 미정): PoC에서는 거래 횟수와 후기만 보여 준다.
  // 평점·후기 수는 저장하지 않고 실제 후기에서 계산한다(API의 ExperienceSummary).
  deals: z.number(),
});
export type Experience = z.infer<typeof experienceSchema>;

export const experienceReviewSchema = z.object({
  id: z.string(),
  experienceId: z.string(),
  author: z.string(),
  text: z.string(),
  rating: z.number().min(1).max(5),
  createdAt: z.string(),
});
export type ExperienceReview = z.infer<typeof experienceReviewSchema>;

// 구매 신청. 결제·정산 방식은 미정(기획서 154행)이라 PoC에서는 신청 → 판매자 수락까지만 다룬다.
export const purchaseRequestInputSchema = z.object({
  experienceId: z.string(),
  buyerName: z.string().trim().min(2, "성함을 입력해 주세요"),
  phone: z.string().regex(/^0\d{1,2}-?\d{3,4}-?\d{4}$/, "연락처 형식을 확인해 주세요 (예: 010-1234-5678)"),
  // 달력에서 고른 날짜 "YYYY-MM-DD"
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "원하는 날짜를 달력에서 골라 주세요"),
  note: z.string().trim().min(5, "원하시는 내용을 5자 이상 적어 주세요"),
});
export type PurchaseRequestInput = z.infer<typeof purchaseRequestInputSchema>;

export const purchaseRequestSchema = purchaseRequestInputSchema.extend({
  id: z.string(),
  status: z.enum(["requested", "accepted", "declined"]),
  createdAt: z.string(),
});
export type PurchaseRequest = z.infer<typeof purchaseRequestSchema>;
