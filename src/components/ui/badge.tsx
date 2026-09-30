import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// 상태 표시는 배경 없이 색 글씨로만 보여 준다. PRO 표시만 이름표 역할이라 어두운 바탕을 유지한다.
const badgeVariants = cva("inline-flex items-center whitespace-nowrap font-bold", {
  variants: {
    variant: {
      default: "text-base text-muted-foreground",
      primary: "text-base text-primary-strong",
      wood: "text-base text-wood",
      success: "text-base text-success",
      warning: "text-base text-accent",
      pro: "h-7 rounded-full bg-pro px-2.5 text-sm text-white",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Badge({
  className,
  variant,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
