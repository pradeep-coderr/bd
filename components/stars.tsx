"use client";

import { useMemo } from "react";
import { mulberry32 } from "@/lib/random";

interface Star {
  id: number;
  size: string;
  opacity: string;
  delay: string;
  left: string;
  top: string;
  bx: string;
  by: string;
}

export default function Stars({ count }: { count: number }) {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = mulberry32(i * 2654435761 + count * 40503);
        return {
          id: i,
          size: (r() * 2 + 1).toFixed(1) + "px",
          opacity: (r() * 0.5 + 0.3).toFixed(2),
          delay: (r() * 6).toFixed(1) + "s",
          left: r() * 100 + "%",
          top: r() * 100 + "%",
          bx: (r() * 200 - 50) + "%",
          by: (r() * 200 - 50) + "%",
        };
      }),
    [count]
  );

  return (
    <div className="stars" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            ["--s" as string]: s.size,
            ["--o" as string]: s.opacity,
            ["--d" as string]: s.delay,
            left: s.left,
            top: s.top,
            ["--bx" as string]: s.bx,
            ["--by" as string]: s.by,
          }}
        />
      ))}
    </div>
  );
}
