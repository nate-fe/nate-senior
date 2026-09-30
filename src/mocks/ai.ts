import type { CareRecord, OutputType, Resident } from "@/entities";

// AI 변환 목업. 실제 연동 시 이 함수를 LLM 호출(서버 라우트)로 교체한다.
// 결과물은 보내기 전(draft) 상태로 만들어지고, 요양보호사가 확인하고 보내야 전송·저장된다.
export function mockGenerate(type: OutputType, record: CareRecord, resident: Resident): string {
  const date = new Date(record.createdAt).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  const lines = record.text
    .split(/[.。\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  switch (type) {
    case "guardian_notice":
      return [
        `${resident.name} 어르신 보호자님, 안녕하세요.`,
        "",
        `${date} 어르신의 하루 소식을 전해 드립니다.`,
        ...lines.map((l) => `· ${l}`),
        "",
        "오늘도 어르신 곁에서 세심하게 살피겠습니다. 편안한 하루 보내세요.",
        "",
        "— 햇살요양원 드림",
      ].join("\n");
    case "counsel_log":
      return [
        `[상담·활동 기록] ${resident.name} (${resident.age}세, ${resident.room}, ${resident.careGrade}등급)`,
        `작성일: ${date} / 작성자: ${record.authorName}`,
        "",
        "■ 관찰 내용",
        ...lines.map((l) => `  - ${l}`),
        "",
        "■ 특이사항: 없음",
        "■ 향후 계획: 현 상태 관찰 지속",
      ].join("\n");
    case "monthly_report":
      return [
        `[월간 활동보고서 초안] ${resident.name}`,
        "",
        "■ 이번 달 누적 기록: 이 기록을 포함해 월말에 자동 집계됩니다.",
        "■ 주요 활동",
        ...lines.map((l) => `  - ${l}`),
        "■ 식사·건강 추이: 월말 집계 후 표시",
      ].join("\n");
    case "nhis_form":
      return [
        "[장기요양급여 제공기록 초안]",
        `수급자: ${resident.name} / 장기요양등급: ${resident.careGrade}등급`,
        `제공일자: ${date}`,
        "",
        "제공 내용:",
        ...lines.map((l) => `  - ${l}`),
        "",
        "※ 실제 공단 양식 확정 전 임시 형식입니다. 담당자 확인 후 제출하세요.",
      ].join("\n");
  }
}
