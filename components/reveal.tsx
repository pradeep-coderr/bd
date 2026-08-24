"use client";

import Stars from "./stars";
import Hearts from "./hearts";

export default function Reveal({ active }: { active: boolean }) {
  return (
    <section id="reveal" className={active ? "active" : ""}>
      <Stars count={30} />
      <Hearts count={9} />
      <div className="reveal-inner">
        <p className="reveal-line headline">Happy Birthday, Poku ❤️</p>
        <p className="reveal-line sub">
          Our first birthday together — and I&apos;m not even there. I&apos;m still finding a way to make it count.
        </p>
        <button
          type="button"
          className="continue-btn"
          id="continueBtn"
          onClick={() => document.getElementById("letter")?.scrollIntoView({ behavior: "smooth" })}
        >
          Continue
        </button>
      </div>
    </section>
  );
}
