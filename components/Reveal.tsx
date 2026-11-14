"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { AriaRole, ReactNode } from "react";
import { EASE, REVEAL_VIEWPORT } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  role?: AriaRole;
};

export default function Reveal({
  children,
  className,
  delay = 0,
  id,
  role,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      id={id}
      className={className}
      role={role}
      initial={{
        opacity: 0,
        y: reduceMotion ? 0 : 26,
      }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{
        duration: reduceMotion ? 0.3 : 0.85,
        ease: EASE,
        delay: reduceMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
