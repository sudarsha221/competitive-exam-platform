"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

type MotionContainerProps = HTMLMotionProps<"div">;

export function FadeIn({ children, ...props }: MotionContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function PageTransition({ children, ...props }: MotionContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
