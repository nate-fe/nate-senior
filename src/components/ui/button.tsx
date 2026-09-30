import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// 50~70대 현장 인력을 고려해 기본 버튼은 높이 60px(3rem @20px), 굵은 글씨의 알약형으로 둔다.
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-[1.15em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-strong",
        secondary: "bg-wood-soft text-wood-strong hover:bg-wood-soft-hover",
        outline: "border-2 border-border-strong bg-surface text-foreground hover:bg-muted",
        // 목록 안의 작업 버튼: 회색·베이지 행 위에서도 눈에 띄도록 흰 바탕 + 카키 테두리
        line: "border-2 border-primary bg-surface text-primary-strong hover:bg-primary-soft",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        pro: "bg-pro text-white hover:bg-pro/85",
      },
      size: {
        default: "h-12 px-6 text-base",
        sm: "h-10 px-4 text-sm",
        lg: "h-14 px-8 text-lg",
        icon: "size-12",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
