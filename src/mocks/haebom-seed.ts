import type { Experience, ExperienceReview, PurchaseRequest, Seller } from "@/entities/haebom";
import { toDateKey } from "@/lib/utils";

// 해봄 PoC 시드 데이터. 기획서 "먼저 검증할 것"의 1단계(경험 상품 3~5개 선정)를 가정해
// 핵심 상품 예시(60~65행)에서 5개를 골랐다. 가격·거래 횟수·후기는 모두 예시 값이다.

export const seedSellers: Seller[] = [
  {
    id: "sl-1",
    name: "김정비",
    age: 66,
    background: "자동차 정비 30년",
    story: "정비소를 하면서 중고차를 2,000대 넘게 봤어요. 겉은 멀쩡해도 사고 난 차는 금방 알아봅니다.",
    photo: "/profile.png",
  },
  {
    id: "sl-2",
    name: "이정숙",
    age: 63,
    background: "부동산 중개사무소 실장 25년",
    story: "전·월세 계약을 수천 건 옆에서 봤어요. 계약서에서 꼭 확인해야 할 곳을 짚어 드립니다.",
  },
  {
    id: "sl-3",
    name: "박영순",
    age: 67,
    background: "살림 40년 · 이사 12번",
    story: "이사를 12번 다니며 좁은 집에 맞게 정리하는 요령이 생겼어요. 버릴 것과 둘 것부터 같이 정해요.",
  },
  {
    id: "sl-4",
    name: "최말순",
    age: 70,
    background: "한식당 운영 25년",
    story: "식당을 하며 매일 찬을 만들었어요. 적은 재료로 여러 가지 반찬 만드는 법을 알려 드려요.",
  },
  {
    id: "sl-5",
    name: "정용수",
    age: 62,
    background: "대기업 구매팀 28년 · 퇴직 후 재취업",
    story: "쉰여덟에 퇴직하고 1년 만에 다시 일을 찾았어요. 그때 몰라서 헤맸던 것들을 먼저 알려 드립니다.",
  },
];

export const seedExperiences: Experience[] = [
  {
    id: "ex-1",
    sellerId: "sl-1",
    category: "car",
    title: "중고차 살 때 옆에서 같이 봐드려요",
    format: "accompany",
    duration: "2시간",
    area: "서울·경기",
    price: 70000,
    includes: ["차량 외관·하부 사고 흔적 확인", "시운전 동행", "적정 가격 의견"],
    deals: 23,
  },
  {
    id: "ex-2",
    sellerId: "sl-2",
    category: "home",
    title: "전·월세 계약 전, 계약서 같이 봐드려요",
    format: "consult",
    duration: "1시간",
    area: "전화·영상",
    price: 30000,
    includes: ["등기부등본 보는 법", "계약서 특약 확인", "보증금 지키는 방법"],
    deals: 41,
  },
  {
    id: "ex-3",
    sellerId: "sl-3",
    category: "home",
    title: "좁은 집 넓게 쓰는 정리·수납 코칭",
    format: "visit",
    duration: "3시간",
    area: "서울",
    price: 90000,
    includes: ["버릴 것·둘 것 함께 정하기", "수납 자리 잡기", "살림 동선 짜기"],
    deals: 12,
  },
  {
    id: "ex-4",
    sellerId: "sl-4",
    category: "life",
    title: "일주일 반찬, 한 번에 만드는 법",
    format: "visit",
    duration: "2시간",
    area: "서울·경기",
    price: 50000,
    includes: ["장보기 목록 짜기", "반찬 4가지 같이 만들기", "보관 요령"],
    deals: 18,
  },
  {
    id: "ex-5",
    sellerId: "sl-5",
    category: "career",
    title: "퇴직 후 재취업, 먼저 해본 분이 알려드려요",
    format: "mentoring",
    duration: "1시간",
    area: "전화·영상",
    price: 40000,
    includes: ["이력서 고치기", "구인처 찾는 법", "면접에서 나이 질문 대처"],
    deals: 9,
  },
];

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

// 후기. 중고차(ex-1) 8개, 계약서(ex-2) 6개로 상세 화면의 "더보기"(5개 초과)를 시연한다.
export const seedExperienceReviews: ExperienceReview[] = [
  { id: "er-1", experienceId: "ex-1", author: "30대 직장인", rating: 5, createdAt: daysAgo(2), text: "혼자 갔으면 사고 차를 살 뻔했어요. 하부를 보자마자 알아보시더라고요." },
  { id: "er-2", experienceId: "ex-1", author: "20대 첫 차 구매", rating: 5, createdAt: daysAgo(5), text: "가격 흥정까지 옆에서 도와주셔서 50만원 아꼈어요." },
  { id: "er-3", experienceId: "ex-1", author: "40대 자영업", rating: 5, createdAt: daysAgo(9), text: "화물차라 걱정했는데 엔진 소리만 듣고도 상태를 짚어 주셨어요." },
  { id: "er-4", experienceId: "ex-1", author: "30대 신혼부부", rating: 4, createdAt: daysAgo(14), text: "설명이 친절했어요. 시간이 조금 더 길었으면 좋겠어요." },
  { id: "er-5", experienceId: "ex-1", author: "50대 주부", rating: 5, createdAt: daysAgo(20), text: "딜러 말만 믿었으면 큰일 날 뻔했어요. 든든한 아버지 같았습니다." },
  { id: "er-6", experienceId: "ex-1", author: "20대 대학원생", rating: 5, createdAt: daysAgo(27), text: "타이어, 브레이크 보는 법까지 알려 주셔서 다음엔 혼자서도 볼 수 있을 것 같아요." },
  { id: "er-7", experienceId: "ex-1", author: "30대 직장인", rating: 5, createdAt: daysAgo(35), text: "침수차 흔적을 찾아내셔서 계약 직전에 멈췄어요. 정말 감사합니다." },
  { id: "er-8", experienceId: "ex-1", author: "40대 회사원", rating: 4, createdAt: daysAgo(48), text: "약속 시간을 잘 지키시고 꼼꼼하셨어요." },

  { id: "er-9", experienceId: "ex-2", author: "사회초년생", rating: 5, createdAt: daysAgo(3), text: "특약에 뭘 넣어야 하는지 처음 알았어요. 든든했습니다." },
  { id: "er-10", experienceId: "ex-2", author: "20대 대학생", rating: 5, createdAt: daysAgo(8), text: "등기부등본 보는 법을 하나하나 알려 주셨어요." },
  { id: "er-11", experienceId: "ex-2", author: "30대 신혼부부", rating: 4, createdAt: daysAgo(12), text: "전세 사기 걱정이 컸는데 확인할 곳을 정리해 주셔서 마음이 놓였어요." },
  { id: "er-12", experienceId: "ex-2", author: "30대 직장인", rating: 5, createdAt: daysAgo(18), text: "계약 당일 전화로도 짚어 주셔서 실수 없이 마쳤어요." },
  { id: "er-13", experienceId: "ex-2", author: "20대 사회초년생", rating: 5, createdAt: daysAgo(25), text: "부모님 대신 물어볼 사람이 생긴 느낌이었어요." },
  { id: "er-14", experienceId: "ex-2", author: "40대 자영업", rating: 4, createdAt: daysAgo(40), text: "상가 계약도 기본은 같다며 조언해 주셨어요." },

  { id: "er-15", experienceId: "ex-3", author: "신혼부부", rating: 5, createdAt: daysAgo(6), text: "원룸이 이렇게 넓어질 줄 몰랐어요. 요령을 알려 주셔서 계속 유지돼요." },
  { id: "er-16", experienceId: "ex-3", author: "30대 맞벌이", rating: 5, createdAt: daysAgo(21), text: "버릴 것을 같이 정해 주시니 결정이 쉬웠어요." },
  { id: "er-17", experienceId: "ex-4", author: "맞벌이 부부", rating: 5, createdAt: daysAgo(4), text: "주말 두 시간으로 일주일 반찬 걱정이 없어졌어요." },
  { id: "er-18", experienceId: "ex-4", author: "20대 자취생", rating: 5, createdAt: daysAgo(16), text: "장보기 목록부터 짜 주셔서 식비가 줄었어요." },
  { id: "er-19", experienceId: "ex-5", author: "60대 퇴직자", rating: 5, createdAt: daysAgo(7), text: "같은 길을 먼저 걸은 분이라 말 한마디가 와닿았어요." },
  { id: "er-20", experienceId: "ex-5", author: "50대 희망퇴직 예정자", rating: 4, createdAt: daysAgo(30), text: "이력서를 어떻게 고칠지 감이 왔어요." },
];

const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
const daysLater = (n: number) => toDateKey(new Date(Date.now() + n * 24 * 60 * 60 * 1000));

// 판매자 신청함 시연용(김정비 판매자 기준)
export const seedPurchaseRequests: PurchaseRequest[] = [
  {
    id: "pr-1",
    experienceId: "ex-1",
    buyerName: "윤서준",
    phone: "010-****-4410",
    preferredDate: daysLater(4),
    note: "이번 주말에 수원에서 2019년식 SUV를 보기로 했어요. 같이 가 주실 수 있을까요?",
    status: "requested",
    createdAt: hoursAgo(2),
  },
  {
    id: "pr-2",
    experienceId: "ex-1",
    buyerName: "한지민",
    phone: "010-****-9021",
    preferredDate: daysLater(8),
    note: "첫 차라 아무것도 몰라요. 경차 위주로 보고 있습니다.",
    status: "accepted",
    createdAt: hoursAgo(26),
  },
];

// 해봄 판매자 화면에서 "로그인한 판매자"로 쓰는 데모 계정
export const DEMO_SELLER_ID = "sl-1";
