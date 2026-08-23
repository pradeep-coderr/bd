"use client";

import { useMemo } from "react";
import { mulberry32 } from "@/lib/random";

interface Heart {
  id: number;
  glyph: string;
  left: string;
  size: string;
  duration: string;
  delay: string;
  opacity: string;
  rot0: string;
  rot1: string;
}

export default function Hearts({ count = 9 }: { count?: number }) {
  const hearts = useMemo<Heart[]>(() => {
    const glyphs = ["❤", "♡"];
    return Array.from({ length: count }, (_, i) => {
      const r = mulberry32(i * 1013904223 + count * 12820163);
      return {
        id: i,
        glyph: glyphs[i % glyphs.length],
        left: (r() * 90 + 5) + "%",
        size: (r() * 10 + 12) + "px",
        duration: (r() * 2 + 3.2) + "s",
        delay: (r() * 1.5 + 0.6) + "s",
        opacity: (r() * 0.3 + 0.35).toFixed(2),
        rot0: (r() * 20 - 10) + "deg",
        rot1: (r() * 20 - 10) + "deg",
      };
    });
  }, [count]);

  return (
    <div className="hearts" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart"
          style={{
            left: h.left,
            ["--hs" as string]: h.size,
            ["--hd" as string]: h.duration,
            ["--hdelay" as string]: h.delay,
            ["--ho" as string]: h.opacity,
            ["--hr0" as string]: h.rot0,
            ["--hr1" as string]: h.rot1,
          }}
        >
          {h.glyph}
        </span>
      ))}
    </div>
  );
}
