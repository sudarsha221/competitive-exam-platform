"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

export type CardProps = HTMLMotionProps<"div"> & {
  interactive?: boolean;
};

export function Card({
  interactive = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={interactive ? { y: -3 } : undefined}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      className={`rounded-2xl border border-border bg-surface shadow-(--shadow-card) ${interactive ? "transition-shadow duration-200 hover:shadow-lg" : ""} ${className}`}
      {...props}
    />
  );
}
