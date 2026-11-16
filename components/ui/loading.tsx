"use client";

import { motion, useReducedMotion } from "framer-motion";

export type LoadingProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "size-4 border-2",
  md: "size-6 border-[3px]",
  lg: "size-9 border-4",
};

export function Loading({ label = "Loading", size = "md" }: LoadingProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span
      role="status"
      className="inline-flex items-center gap-2 text-sm text-muted"
    >
      <motion.span
        aria-hidden="true"
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
        className={`inline-block rounded-full border-border border-t-primary ${sizes[size]}`}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
