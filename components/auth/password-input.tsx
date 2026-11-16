"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { InputProps } from "@/components/ui/input";

type PasswordInputProps = Omit<InputProps, "type">;

export function PasswordInput({ className = "", ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={`pr-12 ${className}`}
      />
      <button
        type="button"
        className="absolute right-2 top-[2.05rem] grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={visible ? "visible" : "hidden"}
            initial={{ opacity: 0, rotateY: -70, scale: 0.8 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: 70, scale: 0.8 }}
            transition={{ duration: 0.16 }}
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
