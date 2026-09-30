import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// 큰 라운드 + 옅은 그림자의 흰 면
export const cardClass =
  "rounded-3xl bg-surface shadow-[0_1px_2px_rgba(36,29,22,0.04),0_12px_32px_-16px_rgba(36,29,22,0.12)]";

export function Card({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn(cardClass, className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 px-6 pt-6 pb-4 md:px-7", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 className={cn("text-xl font-extrabold tracking-[-0.03em]", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-base text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-6 pb-6 md:px-7", className)} {...props} />;
}
