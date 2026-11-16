"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:brightness-105 hover:shadow-md",
  secondary:
    "bg-accent text-foreground hover:brightness-[0.97] dark:hover:brightness-110",
  outline:
    "border border-border bg-surface text-foreground hover:border-primary/40 hover:bg-surface-muted",
  ghost: "bg-transparent text-foreground hover:bg-surface-muted",
  danger: "bg-danger text-white shadow-sm hover:brightness-105 dark:bg-rose-700",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
  icon: "size-11 p-0",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
