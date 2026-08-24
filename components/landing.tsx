"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Stars from "./stars";
import { postVisit } from "@/lib/client/visit";

export default function Landing({ onUnlocked }: { onUnlocked: () => void }) {
  const [dissolving, setDissolving] = useState(false);
  const [hidden, setHidden] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    document.documentElement.classList.add("scroll-locked");
    document.body.classList.add("scroll-locked");
    return () => {
      document.documentElement.classList.remove("scroll-locked");
      document.body.classList.remove("scroll-locked");
    };
  }, []);

  const finishTransition = useCallback(() => {
    setHidden(true);
    onUnlocked();
  }, [onUnlocked]);

  const handleEnter = useCallback(() => {
    if (fired.current) return;
    fired.current = true;

    postVisit().catch(() => {});

    setDissolving(true);

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishTransition();
    } else {
      setTimeout(finishTransition, 900);
    }
  }, [finishTransition]);

  return (
    <section id="landing" className={`${dissolving ? "dissolving" : ""} ${hidden ? "hidden" : ""}`}>
      <Stars count={26} />
      <div className="landing-inner">
        <p className="eyebrow">a little something</p>
        <p className="landing-line big">Hey, Poku</p>
        <p className="landing-line small">I made something for you. Come with me.</p>
        <button type="button" className="enter-btn" id="enterBtn" onClick={handleEnter}>
          Start the journey
        </button>
      </div>
    </section>
  );
}
