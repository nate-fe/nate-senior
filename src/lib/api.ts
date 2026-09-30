import {
  type CareRecord,
  type Guardian,
  type GuardianReply,
  type Institution,
  OUTPUT_TYPES,
  type Output,
  type Plan,
  type RecordInput,
  type Resident,
} from "@/entities";
import { mockGenerate } from "@/mocks/ai";
import {
  seedGuardians,
  seedInstitution,
  seedOutputs,
  seedRecords,
  seedReplies,
  seedResidents,
} from "@/mocks/seed";

// 브라우저 메모리에만 있는 가짜 백엔드. 새로고침하면 시드 상태로 돌아간다.
// 실제 API가 생기면 함수 시그니처는 유지하고 내부만 fetch로 바꾼다.
const db = {
  institution: structuredClone(seedInstitution),
  residents: structuredClone(seedResidents),
  guardians: structuredClone(seedGuardians),
  records: structuredClone(seedRecords),
  outputs: structuredClone(seedOutputs),
  replies: structuredClone(seedReplies),
};

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
const clone = <T>(v: T): T => structuredClone(v);

// 시드 기록에 빠진 문서는 보내기 전 초안으로 채워 둔다(문서 4종이 늘 갖춰지도록).
for (const record of db.records) {
  const resident = db.residents.find((r) => r.id === record.residentId);
  if (!resident) continue;
  for (const type of OUTPUT_TYPES) {
    if (db.outputs.some((o) => o.recordId === record.id && o.type === type)) continue;
    db.outputs.push({
      id: `${record.id}-${type}`,
      recordId: record.id,
      type,
      content: mockGenerate(type, record, resident),
      status: "draft",
      updatedAt: record.createdAt,
    });
  }
}

function findOrThrow<T extends { id: string }>(list: T[], id: string, label: string): T {
  const item = list.find((x) => x.id === id);
  if (!item) throw new Error(`${label}을(를) 찾을 수 없습니다: ${id}`);
  return item;
}

// ── 기관 ──────────────────────────────────────────────

export async function getInstitution(): Promise<Institution> {
  await delay();
  return clone(db.institution);
}

export async function setPlan(plan: Plan): Promise<Institution> {
  await delay();
  db.institution.plan = plan;
  return clone(db.institution);
}

export async function listResidents(): Promise<Resident[]> {
  await delay();
  return clone(db.residents);
}

export async function listGuardians(): Promise<Guardian[]> {
  await delay();
  return clone(db.guardians);
}

// ── 기록 · AI 결과물 ─────────────────────────────────

export type RecordSummary = CareRecord & { resident: Resident; outputs: Output[] };

export async function listRecords(): Promise<RecordSummary[]> {
  await delay();
  return clone(
    [...db.records]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((r) => ({
        ...r,
        resident: findOrThrow(db.residents, r.residentId, "어르신"),
        outputs: db.outputs.filter((o) => o.recordId === r.id),
      })),
  );
}

export async function getRecord(id: string): Promise<RecordSummary> {
  await delay();
  const record = findOrThrow(db.records, id, "기록");
  return clone({
    ...record,
    resident: findOrThrow(db.residents, record.residentId, "어르신"),
    outputs: db.outputs.filter((o) => o.recordId === id),
  });
}

// 기록 1건 → AI가 문서 4종 초안을 만든다. Pro 문서도 초안은 만들어 두고, 열람은 요금제로 잠근다.
export async function createRecord(input: RecordInput, authorName: string): Promise<CareRecord> {
  await delay(1200);
  const record: CareRecord = { ...input, id: uid("rec"), authorName, createdAt: now() };
  const resident = findOrThrow(db.residents, input.residentId, "어르신");
  db.records.push(record);
  for (const type of OUTPUT_TYPES) {
    db.outputs.push({
      id: uid("out"),
      recordId: record.id,
      type,
      content: mockGenerate(type, record, resident),
      status: "draft",
      updatedAt: now(),
    });
  }
  return clone(record);
}

export async function updateOutput(id: string, content: string): Promise<Output> {
  await delay();
  const output = findOrThrow(db.outputs, id, "결과물");
  if (output.status === "sent") throw new Error("이미 전송된 결과물은 수정할 수 없습니다");
  output.content = content;
  output.status = "draft";
  output.updatedAt = now();
  return clone(output);
}

// 요양보호사가 내용을 보고 누르면 바로 처리된다. 보호자 알림장은 전송, 나머지는 저장.
export async function approveOutput(id: string, reviewer: string): Promise<Output> {
  await delay();
  const output = findOrThrow(db.outputs, id, "결과물");
  output.status = output.type === "guardian_notice" ? "sent" : "approved";
  output.reviewedBy = reviewer;
  output.updatedAt = now();
  return clone(output);
}

// ── 보호자 ────────────────────────────────────────────

export type GuardianFeedItem = {
  output: Output;
  record: CareRecord;
  resident: Resident;
  replies: GuardianReply[];
};

export async function getGuardian(id: string): Promise<Guardian> {
  await delay();
  return clone(findOrThrow(db.guardians, id, "보호자"));
}

export async function listGuardianFeed(guardianId: string): Promise<GuardianFeedItem[]> {
  await delay();
  const residents = db.residents.filter((r) => r.guardianIds.includes(guardianId));
  const items: GuardianFeedItem[] = [];
  for (const output of db.outputs) {
    if (output.type !== "guardian_notice" || output.status !== "sent") continue;
    const record = findOrThrow(db.records, output.recordId, "기록");
    const resident = residents.find((r) => r.id === record.residentId);
    if (!resident) continue;
    items.push({
      output,
      record,
      resident,
      replies: db.replies.filter((r) => r.outputId === output.id),
    });
  }
  return clone(items.sort((a, b) => b.output.updatedAt.localeCompare(a.output.updatedAt)));
}

// 보호자가 알림장을 처음 열면 읽은 시각을 남긴다(요양보호사 화면에 "보호자 확인" 표시).
export async function markNoticeRead(outputId: string): Promise<Output> {
  await delay(100);
  const output = findOrThrow(db.outputs, outputId, "결과물");
  output.readAt ??= now();
  return clone(output);
}

// 기관이 받은 보호자 답글 전체(원장 대시보드 지표용)
export async function listReplies(): Promise<GuardianReply[]> {
  await delay();
  return clone(db.replies);
}

export async function addReply(outputId: string, guardianId: string, text: string): Promise<GuardianReply> {
  await delay();
  const reply: GuardianReply = { id: uid("rep"), outputId, guardianId, text, createdAt: now() };
  db.replies.push(reply);
  return clone(reply);
}

export async function updateConsents(
  guardianId: string,
  consents: Partial<Guardian["consents"]>,
): Promise<Guardian> {
  await delay();
  const guardian = findOrThrow(db.guardians, guardianId, "보호자");
  guardian.consents = { ...guardian.consents, ...consents };
  return clone(guardian);
}

// ── 도입 문의 ────────────────────────────────────────

export type Inquiry = {
  institutionName: string;
  contactName: string;
  phone: string;
  residentCount: number;
  message?: string;
};

export async function submitInquiry(inquiry: Inquiry): Promise<{ ok: true }> {
  await delay(600);
  console.info("[mock] 도입 문의 접수", inquiry);
  return { ok: true };
}
