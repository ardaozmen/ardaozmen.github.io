"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const iconLink =
  "rounded-sm text-neutral-500 transition-colors duration-500 hover:text-neutral-200 focus-visible:text-neutral-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-neutral-600";

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
        aria-label="GitHub"
        className={iconLink}
      >
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="currentColor"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
        </svg>
      </a>
      <a
        href="https://www.linkedin.com/in/ardacemozmen"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className={iconLink}
      >
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="currentColor"
        >
          <path d="M13.63 13.63h-2.37V9.92c0-.89-.02-2.03-1.24-2.03-1.24 0-1.43.97-1.43 1.96v3.78H6.22V6h2.28v1.04h.03c.32-.6 1.09-1.24 2.25-1.24 2.4 0 2.85 1.58 2.85 3.64v4.19ZM3.54 4.96a1.38 1.38 0 1 1 0-2.75 1.38 1.38 0 0 1 0 2.75Zm1.19 8.67H2.35V6h2.38v7.63ZM14.82 0H1.18C.53 0 0 .52 0 1.15v13.7C0 15.48.53 16 1.18 16h13.63c.65 0 1.19-.52 1.19-1.15V1.15C16 .52 15.46 0 14.82 0Z" />
        </svg>
      </a>
    </motion.footer>
  );
}
