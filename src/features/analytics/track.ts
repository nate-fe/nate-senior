// 이벤트 추적. 기능별 사용량이 사업 검증 자료가 되므로 초기부터 모든 주요 행동에 심는다.
// 지금은 콘솔 출력만 하고, 도구가 정해지면(PostHog 등) 이 함수 내부만 바꾼다.

export type AnalyticsEvent =
  | "landing_cta_clicked"
  | "inquiry_submitted"
  | "record_started"
  | "record_voice_used"
  | "record_photo_added"
  | "record_submitted"
  | "output_viewed"
  | "output_edited"
  | "output_approved"
  | "upgrade_prompt_viewed"
  | "upgrade_clicked"
  | "plan_changed"
  | "guardian_notice_viewed"
  | "guardian_reply_sent"
  | "guardian_consent_changed"
  // 해봄
  | "haebom_experience_viewed"
  | "haebom_purchase_requested"
  | "haebom_request_answered";

export function track(event: AnalyticsEvent, props: Record<string, unknown> = {}) {
  if (process.env.NODE_ENV !== "production") {
    console.info("[track]", event, props);
  }
}
