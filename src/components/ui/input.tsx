import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-2xl border-2 border-border bg-surface px-5 text-base placeholder:text-placeholder focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 aria-invalid:border-danger aria-invalid:ring-danger/15";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldClass, "h-14", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldClass, "min-h-36 py-4 leading-relaxed", className)} {...props} />;
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("text-base font-bold text-foreground", className)} {...props} />;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-base font-semibold text-danger">
      {message}
    </p>
  );
}
