"use client";

import dynamic from "next/dynamic";

const Field = dynamic(() => import("./Field"), { ssr: false });

export default function Background() {
  return (
    <div aria-hidden className="fixed inset-0 z-0">
      <Field />
    </div>
  );
}
