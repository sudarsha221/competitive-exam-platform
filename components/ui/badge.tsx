import type { HTMLAttributes } from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "outline";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variants: Record<BadgeVariant, string> = {
  default: "bg-surface-muted text-foreground",
  primary: "bg-accent text-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  outline: "border border-border bg-transparent text-muted",
};

export function Badge({
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold leading-none ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
