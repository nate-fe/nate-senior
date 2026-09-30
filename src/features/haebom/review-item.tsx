import { Star } from "lucide-react";
import type { ExperienceReview } from "@/entities/haebom";

// 상세 화면과 후기 전체 화면이 같이 쓰는 후기 한 개
export function ReviewItem({ review: r }: { review: ExperienceReview }) {
  return (
    <li className="rounded-2xl bg-background p-5">
      <p className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-0.5" aria-label={`별점 5점 중 ${r.rating}점`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} aria-hidden className={i < r.rating ? "size-4 fill-sun text-sun" : "size-4 text-muted-strong"} />
          ))}
        </span>
        <span className="text-sm text-muted-foreground">
          {new Date(r.createdAt).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}
        </span>
      </p>
      <p className="mt-2 text-lg leading-relaxed">“{r.text}”</p>
      <p className="mt-2 text-base text-muted-foreground">{r.author}</p>
    </li>
  );
}
