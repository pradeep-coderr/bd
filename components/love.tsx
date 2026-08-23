"use client";

import { useState } from "react";

const CARDS = [
  {
    label: "01",
    title: "Your voice",
    msg: "You can make a completely ordinary sentence sound like the best part of my day. I've never told you that directly.",
  },
  {
    label: "02",
    title: "How you dealt with my moods",
    msg: "I wasn't always easy. You never once made me feel like too much.",
  },
  {
    label: "03",
    title: "Your maturity",
    msg: "You handle things — us, distance, hard days — with a steadiness I don't always have. I lean on that more than you know.",
  },
  {
    label: "04",
    title: "Ujjau. My god. Anga.",
    msg: "The little words that just slip out of you when you're talking. I don't know why, but they're some of my favorite sounds in the world.",
  },
  {
    label: "05",
    title: "How safe I feel with you",
    msg: "I've told you things I've never said out loud to anyone else. You never once made that feel risky.",
  },
  {
    label: "06",
    title: "When you get talk-active",
    msg: "The second you have something to tell me, your whole voice changes — faster, brighter, like you can't get it out fast enough. I could listen to that shift forever.",
  },
];

function LoveCard({ label, title, msg }: { label: string; title: string; msg: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button className="love-card" aria-pressed={open} onClick={() => setOpen((v) => !v)}>
      <div className="love-card-inner">
        <div className="love-card-face love-card-front">
          <p className="love-card-label">{label}</p>
          <p className="love-card-title">{title}</p>
        </div>
        <div className="love-card-face love-card-back">
          <p className="love-card-msg">{msg}</p>
        </div>
      </div>
    </button>
  );
}

export default function Love() {
  return (
    <section id="love">
      <div className="love-head">
        <p className="letter-eyebrow">things i love about you</p>
        <p className="love-title">Tap a card</p>
        <p className="love-hint">each one flips over</p>
      </div>
      <div className="love-grid">
        {CARDS.map((c) => (
          <LoveCard key={c.label} label={c.label} title={c.title} msg={c.msg} />
        ))}
      </div>
    </section>
  );
}
