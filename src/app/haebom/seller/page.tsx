"use client";

import { Phone } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cardClass } from "@/components/ui/card";
import { track } from "@/features/analytics/track";
import { SellerAvatar, formatPrice } from "@/features/haebom/ui";
import type { SellerRequest } from "@/lib/haebom-api";
import { useRespondToRequest, useSellerInbox } from "@/lib/haebom-queries";
import { cn, formatDateKey, formatDateTime } from "@/lib/utils";
import { DEMO_SELLER_ID } from "@/mocks/haebom-seed";

// 판매자(시니어)용 신청함. 로그인 전 PoC라 김정비 판매자(sl-1)로 고정한다.
export default function SellerInboxPage() {
  const sellerId = DEMO_SELLER_ID;
  const { data, isPending } = useSellerInbox(sellerId);
  const respond = useRespondToRequest(sellerId);

  const requests = data?.requests ?? [];
  const incoming = requests.filter((r) => r.status === "requested");
  const accepted = requests.filter((r) => r.status === "accepted");
  const declined = requests.filter((r) => r.status === "declined");
  // 수수료율이 정해지지 않아 판매 금액(수수료 전) 기준으로 보여 준다
  const earnings = accepted.reduce((sum, r) => sum + r.experience.price, 0);

  const answer = (id: string, accept: boolean) =>
    respond.mutate({ id, accept }, { onSuccess: () => track("haebom_request_answered", { requestId: id, accept }) });

  return (
    // haebom-senior-view: 시니어 판매자용 화면이라 기준 글씨를 20px로 키운다(globals.css)
    <div className="haebom-senior-view mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center gap-4">
        {data && <SellerAvatar name={data.seller.name} photo={data.seller.photo} />}
        <div>
          <p className="text-lg font-bold text-muted-foreground">{data ? `${data.seller.name} 님` : " "}</p>
          <h1 className="text-3xl font-extrabold tracking-[-0.04em] md:text-4xl">들어온 신청</h1>
        </div>
      </div>

      {/* 경험이 돈이 되는 것을 바로 보여 준다 */}
      <dl className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl bg-accent-soft p-5">
          <dt className="text-base font-bold text-accent">약속 잡은 경험</dt>
          <dd className="mt-1 text-4xl font-extrabold tracking-[-0.04em]">
            {accepted.length}
            <span className="ml-1 text-xl">건</span>
          </dd>
        </div>
        <div className="rounded-3xl bg-primary-soft p-5">
          <dt className="text-base font-bold text-primary-strong">판매 금액</dt>
          <dd className="mt-1 text-3xl font-extrabold tracking-[-0.04em]">{formatPrice(earnings)}</dd>
        </div>
      </dl>

      {isPending ? (
        <p className="text-lg text-muted-foreground">불러오는 중…</p>
      ) : (
        <>
          <Section title="새 신청" count={incoming.length} empty="새로 들어온 신청이 없어요.">
            {incoming.map((r) => (
              <RequestCard key={r.id} request={r} highlight>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="lg" disabled={respond.isPending} onClick={() => answer(r.id, false)}>
                    어려워요
                  </Button>
                  <Button size="lg" disabled={respond.isPending} onClick={() => answer(r.id, true)}>
                    할게요
                  </Button>
                </div>
              </RequestCard>
            ))}
          </Section>

          <Section title="약속 잡은 신청" count={accepted.length} empty="아직 약속 잡은 신청이 없어요.">
            {accepted.map((r) => (
              <RequestCard key={r.id} request={r}>
                {/* 전화번호는 수락한 뒤에만 보여 준다 */}
                <a
                  href={`tel:${r.phone.replace(/[^0-9]/g, "")}`}
                  className="flex h-14 items-center justify-center gap-2 rounded-full bg-primary-soft text-xl font-bold text-primary-strong"
                >
                  <Phone className="size-6" /> {r.phone}
                </a>
              </RequestCard>
            ))}
          </Section>

          {declined.length > 0 && (
            <p className="text-center text-lg text-muted-foreground">어렵다고 답한 신청 {declined.length}건</p>
          )}
        </>
      )}
    </div>
  );
}

function Section({ title, count, empty, children }: { title: string; count: number; empty: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-extrabold">
        {title} <span className="text-primary">{count}</span>
      </h2>
      {count === 0 ? (
        <p className={cn(cardClass, "p-6 text-lg text-muted-foreground")}>{empty}</p>
      ) : (
        <ul className="flex flex-col gap-3">{children}</ul>
      )}
    </section>
  );
}

function RequestCard({
  request: r,
  highlight,
  children,
}: {
  request: SellerRequest;
  highlight?: boolean;
  children: ReactNode;
}) {
  return (
    <li className={cn(cardClass, "flex flex-col gap-3 p-5 md:p-6", highlight && "ring-2 ring-sun")}>
      <p className="text-base font-bold text-accent">{r.experience.title}</p>
      <p className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-xl font-extrabold">{r.buyerName} 님</span>
        <span className="text-lg font-bold">{formatPrice(r.experience.price)}</span>
      </p>
      <p className="text-lg font-semibold text-primary-strong">원하는 날짜 · {formatDateKey(r.preferredDate)}</p>
      <p className="rounded-2xl bg-background p-5 text-lg leading-relaxed">{r.note}</p>
      <p className="text-base text-muted-foreground">{formatDateTime(r.createdAt)} 신청</p>
      {children}
    </li>
  );
}
