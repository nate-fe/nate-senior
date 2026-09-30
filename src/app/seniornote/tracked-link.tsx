"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { type AnalyticsEvent, track } from "@/features/analytics/track";

export function TrackedLink({
  event,
  props,
  onClick,
  ...rest
}: ComponentProps<typeof Link> & { event: AnalyticsEvent; props?: Record<string, unknown> }) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        track(event, props);
        onClick?.(e);
      }}
    />
  );
}
