"use client";

import { useInView } from "@/lib/useInView";

const LINES = [
  "If I were there right now...",
  "I'd probably hug you first. A long one — the kind that makes up for all the ones I owe you.",
  "Then I'd just look at you for a second. Actually see you, after all this time.",
  "Then I'd annoy you. Immediately. Some things don't change with distance.",
  "We'd go somewhere ordinary — I don't even care where — just to be somewhere together.",
  "I'd probably steal food off your plate without asking.",
  "And somewhere in there, I'd go quiet for a second, just taking it in.",
  "And eventually I'd tell you — out loud, not through a screen — everything I've been saving up to say.",
];

function Line({ children }: { children: string }) {
  const { setRef, inView } = useInView<HTMLParagraphElement>();
  return (
    <p ref={setRef} className={`ifthere-line ${inView ? "in-view" : ""}`}>
      {children}
    </p>
  );
}

export default function IfThere() {
  return (
    <section id="ifthere">
      <p className="letter-eyebrow">if i were there right now</p>
      <div className="ifthere-list">
        {LINES.map((l) => (
          <Line key={l}>{l}</Line>
        ))}
      </div>
    </section>
  );
}
