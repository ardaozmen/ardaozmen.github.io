"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Footer() {
  const reduced = useReducedMotion();

  return (
    <motion.footer
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, delay: 1.6, ease: EASE }}
      className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-6 pb-8 text-[13px] tracking-wide text-neutral-500"
    >
      <span className="select-none">Arda Cem Özmen</span>
      <span aria-hidden className="h-px w-4 bg-neutral-800" />
      <a
        href="https://github.com/ardaozmen"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-sm transition-colors duration-500 hover:text-neutral-200 focus-visible:text-neutral-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-neutral-600"
      >
        GitHub
      </a>
      <a
        href="https://www.linkedin.com/in/ardacemozmen"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-sm transition-colors duration-500 hover:text-neutral-200 focus-visible:text-neutral-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-neutral-600"
      >
        LinkedIn
      </a>
    </motion.footer>
  );
}
