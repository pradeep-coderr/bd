"use client";

import { useInView } from "@/lib/useInView";

const MEMORIES = [
  {
    title: "The night that turned into morning",
    text: "A call that started as \"just a quick hi\" and somehow lasted until the sun came up.",
  },
  {
    title: "The whole day, the whole night",
    text: "No plans, no reason. Just us, talking, for hours that turned into a full day.",
  },
  {
    title: "The photo I don't have",
    text: "I still don't know exactly what you look like laughing. I think about that more than I admit.",
  },
  {
    title: "The Instagram I deleted",
    text: "I was mad at you and deleted my Instagram. Six days later, you called my number at 7:12 in the morning — I missed it. I called back after work, and you told me to come find you there. We picked up right where we left off.",
  },
  {
    title: "The prank that almost broke me",
    text: "You made me believe you didn't want me anymore. I fell for it completely — for a moment it felt too real, and I almost gave up. Then you told me the truth.",
  },
  {
    title: "The questions I kept asking",
    text: "What if your parents chose someone else for you? Do you love me? Can I have you forever? Will you marry me? Do you see a future with me? I asked you all of it. You were ready for every question.",
  },
];

function MemoryCard({ title, text }: { title: string; text: string }) {
  const { setRef, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={setRef} className={`memory-card ${inView ? "in-view" : ""}`}>
      <p className="memory-card-title">{title}</p>
      <p className="memory-card-text">{text}</p>
    </div>
  );
}

export default function Memories() {
  return (
    <section id="memories">
      <div className="memories-head">
        <p className="letter-eyebrow">our memories</p>
        <p className="memories-title">Moments, not photos</p>
      </div>
      <div className="memory-grid">
        {MEMORIES.map((m) => (
          <MemoryCard key={m.title} title={m.title} text={m.text} />
        ))}
      </div>
    </section>
  );
}
