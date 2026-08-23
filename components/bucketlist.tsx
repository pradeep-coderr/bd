"use client";

import { useState } from "react";

const ITEMS = [
  "Watch a sunset together, actually together",
  "Take our first proper trip",
  "Have a completely stupid argument over what to eat",
  "Take a hundred unnecessary photos of nothing important",
  "Celebrate a birthday in the same room",
  "Wake up next to each other, no rush to hang up",
  "Build the home we keep talking about",
];

export default function BucketList() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <section id="bucketlist">
      <div className="bucket-head">
        <p className="letter-eyebrow">things i want to do with you</p>
        <p className="bucket-title">Not someday. Eventually.</p>
        <p className="bucket-sub">tap the ones you&apos;re excited for too</p>
      </div>
      <div className="bucket-list">
        {ITEMS.map((text, i) => (
          <button
            key={text}
            className="bucket-item"
            aria-pressed={checked.has(i)}
            onClick={() => toggle(i)}
          >
            <span className="bucket-check">✓</span>
            <span className="bucket-text">{text}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
