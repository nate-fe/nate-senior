"use client";

import { useExperiences } from "@/lib/haebom-queries";
import { ExperienceCard } from "@/features/haebom/experience-card";

// 거래가 많은 순으로 3개
export function FeaturedExperiences() {
  const { data } = useExperiences();
  const top = [...(data ?? [])].sort((a, b) => b.deals - a.deals).slice(0, 3);
  return (
    <ul className="mt-8 grid gap-3 md:grid-cols-3 md:gap-4">
      {top.map((e) => (
        <li key={e.id}>
          <ExperienceCard experience={e} />
        </li>
      ))}
    </ul>
  );
}
