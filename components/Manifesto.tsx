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
      className="max-w-3xl text-balance text-center text-3xl font-normal leading-[1.25] tracking-[-0.02em] text-neutral-200 sm:text-5xl md:text-6xl"
    >
      Intelligence deserves better systems.
    </motion.h1>
  );
}
