import type {
  Experience,
  ExperienceCategory,
  ExperienceReview,
  PurchaseRequest,
  PurchaseRequestInput,
  Seller,
} from "@/entities/haebom";
import { seedExperienceReviews, seedExperiences, seedPurchaseRequests, seedSellers } from "@/mocks/haebom-seed";

// 해봄 가짜 백엔드. 시니어노트와 같이 브라우저 메모리에만 있고, 새로고침하면 시드 상태로 돌아간다.
const db = {
  sellers: structuredClone(seedSellers),
  experiences: structuredClone(seedExperiences),
  reviews: structuredClone(seedExperienceReviews),
  requests: structuredClone(seedPurchaseRequests),
};

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));
const clone = <T>(v: T): T => structuredClone(v);

function sellerOf(experience: Experience): Seller {
  const seller = db.sellers.find((s) => s.id === experience.sellerId);
  if (!seller) throw new Error(`판매자를 찾을 수 없습니다: ${experience.sellerId}`);
  return seller;
}

// 평점·후기 수는 실제 후기에서 계산한다
export type ExperienceSummary = Experience & { seller: Seller; rating: number; reviewCount: number };

function summarize(experience: Experience): ExperienceSummary {
  const reviews = db.reviews.filter((r) => r.experienceId === experience.id);
  const rating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  return { ...experience, seller: sellerOf(experience), rating, reviewCount: reviews.length };
}

const newestFirst = (a: ExperienceReview, b: ExperienceReview) => b.createdAt.localeCompare(a.createdAt);

export async function listExperiences(category?: ExperienceCategory): Promise<ExperienceSummary[]> {
  await delay();
  const list = category ? db.experiences.filter((e) => e.category === category) : db.experiences;
  return clone(list.map(summarize));
}

export type ExperienceDetail = ExperienceSummary & { reviews: ExperienceReview[] };

export async function getExperience(id: string): Promise<ExperienceDetail> {
  await delay();
  const experience = db.experiences.find((e) => e.id === id);
  if (!experience) throw new Error(`경험 상품을 찾을 수 없습니다: ${id}`);
  return clone({
    ...summarize(experience),
    reviews: db.reviews.filter((r) => r.experienceId === id).sort(newestFirst),
  });
}

export async function createPurchaseRequest(input: PurchaseRequestInput): Promise<PurchaseRequest> {
  await delay(600);
  const request: PurchaseRequest = {
    ...input,
    id: `pr-${Math.random().toString(36).slice(2, 9)}`,
    status: "requested",
    createdAt: new Date().toISOString(),
  };
  db.requests.push(request);
  return clone(request);
}

export type SellerRequest = PurchaseRequest & { experience: Experience };

export type SellerInbox = { seller: Seller; requests: SellerRequest[] };

export async function getSellerInbox(sellerId: string): Promise<SellerInbox> {
  await delay();
  const seller = db.sellers.find((s) => s.id === sellerId);
  if (!seller) throw new Error(`판매자를 찾을 수 없습니다: ${sellerId}`);
  const mine = db.experiences.filter((e) => e.sellerId === sellerId);
  const requests = db.requests
    .map((r) => ({ ...r, experience: mine.find((e) => e.id === r.experienceId) }))
    .filter((r): r is SellerRequest => !!r.experience)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return clone({ seller, requests });
}

export async function respondToRequest(id: string, accept: boolean): Promise<PurchaseRequest> {
  await delay();
  const request = db.requests.find((r) => r.id === id);
  if (!request) throw new Error(`신청을 찾을 수 없습니다: ${id}`);
  request.status = accept ? "accepted" : "declined";
  return clone(request);
}
