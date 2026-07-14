"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Manifesto() {
  const reduced = useReducedMotion();

  return (
    <motion.h1
      initial={reduced ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.8, delay: 0.4, ease: EASE }}
      className="max-w-4xl text-balance text-center text-4xl font-medium leading-[1.15] tracking-[-0.03em] text-neutral-100 sm:text-6xl md:text-7xl"
    >
      Building trusted intelligence.
    </motion.h1>
  );
}
