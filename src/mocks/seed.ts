import type { CareRecord, Guardian, GuardianReply, Institution, Output, Resident } from "@/entities";

// PoC용 시드 데이터. 실제 백엔드(또는 시니어노트 연동)가 정해지면 src/lib/api.ts만 교체한다.

export const seedInstitution: Institution = {
  id: "inst-1",
  name: "햇살요양원",
  type: "nursing_home",
  plan: "free",
};

export const seedResidents: Resident[] = [
  { id: "res-1", institutionId: "inst-1", name: "김순자", age: 84, room: "201호", careGrade: 3, guardianIds: ["gd-1"] },
  { id: "res-2", institutionId: "inst-1", name: "박영철", age: 79, room: "202호", careGrade: 2, guardianIds: ["gd-2"] },
  { id: "res-3", institutionId: "inst-1", name: "이말녀", age: 91, room: "203호", careGrade: 4, guardianIds: ["gd-3"] },
  { id: "res-4", institutionId: "inst-1", name: "최동수", age: 82, room: "205호", careGrade: 3, guardianIds: [] },
];

export const seedGuardians: Guardian[] = [
  {
    id: "gd-1",
    name: "김지현",
    relation: "딸",
    phone: "010-****-1234",
    joined: true,
    consents: { notice: true, dataForRecommendation: false },
  },
  {
    id: "gd-2",
    name: "박민수",
    relation: "아들",
    phone: "010-****-5678",
    joined: true,
    consents: { notice: true, dataForRecommendation: true },
  },
  {
    id: "gd-3",
    name: "이수경",
    relation: "며느리",
    phone: "010-****-9012",
    joined: false,
    consents: { notice: false, dataForRecommendation: false },
  },
];

const today = new Date();
const daysAgo = (n: number, hour = 14) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const seedRecords: CareRecord[] = [
  {
    id: "rec-1",
    residentId: "res-1",
    text: "점심 식사 반 정도 드심. 오후 노래교실에서 '고향의 봄' 따라 부르시며 웃으심. 산책 20분.",
    source: "voice",
    photos: [],
    authorName: "김영숙 요양보호사",
    createdAt: daysAgo(1),
  },
  {
    id: "rec-2",
    residentId: "res-2",
    text: "오전 물리치료 참여. 무릎 통증 호소 없음. 저녁 식사 모두 드심. 딸과 영상통화 10분.",
    source: "text",
    photos: [],
    authorName: "김영숙 요양보호사",
    createdAt: daysAgo(0, 10),
  },
  {
    id: "rec-3",
    residentId: "res-1",
    text: "아침 죽 한 그릇 모두 드심. 오전 체조 참여. 손녀 사진 보시며 이야기 나누심.",
    source: "voice",
    photos: [],
    authorName: "김영숙 요양보호사",
    createdAt: daysAgo(0, 8),
  },
];

export const seedOutputs: Output[] = [
  {
    id: "out-1",
    recordId: "rec-1",
    type: "guardian_notice",
    content:
      "김순자 어르신 보호자님, 안녕하세요.\n\n오늘 어르신께서는 오후 노래교실에서 '고향의 봄'을 따라 부르시며 환하게 웃으셨어요. 점심은 반 정도 드셨고, 날씨가 좋아 20분 정도 산책도 하셨습니다.\n\n식사량은 저희가 계속 살펴보겠습니다. 편안한 저녁 보내세요.\n\n— 햇살요양원 드림",
    status: "sent",
    reviewedBy: "김영숙 요양보호사",
    updatedAt: daysAgo(1, 17),
    readAt: daysAgo(1, 18),
  },
  // 보냈지만 보호자가 아직 읽지 않은 알림장(확인 전)
  {
    id: "out-3",
    recordId: "rec-3",
    type: "guardian_notice",
    content:
      "김순자 어르신 보호자님, 안녕하세요.\n\n오늘 아침 어르신께서 죽 한 그릇을 모두 드셨어요. 오전 체조에도 함께하셨고, 손녀분 사진을 보시며 즐겁게 이야기를 나누셨습니다.\n\n오늘도 편안한 하루 보내세요.\n\n— 햇살요양원 드림",
    status: "sent",
    reviewedBy: "김영숙 요양보호사",
    updatedAt: daysAgo(0, 9),
  },
];

export const seedReplies: GuardianReply[] = [
  {
    id: "rep-1",
    outputId: "out-1",
    guardianId: "gd-1",
    text: "노래 부르셨다니 정말 좋네요. 늘 감사합니다!",
    createdAt: daysAgo(1, 19),
  },
  {
    id: "rep-2",
    outputId: "out-1",
    guardianId: "gd-1",
    text: "이번 주 토요일 오후에 면회 가려고 해요. 괜찮을까요?",
    createdAt: daysAgo(0, 7),
  },
];

// 보호자 알림장 화면에서 "로그인한 보호자"로 쓰는 데모 계정
export const DEMO_GUARDIAN_ID = "gd-1";
