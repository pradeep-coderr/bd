"use client";

import { useState } from "react";
import Stars from "./stars";

export default function Finale() {
  const [showFinal, setShowFinal] = useState(false);

  return (
    <section id="finale">
      <Stars count={30} />
      <div className="finale-inner">
        <p className="finale-line">Distance gets to decide how many kilometers are between us.</p>
        <p className="finale-line big">It doesn&apos;t get to decide how much you mean to me.</p>
        <p className="finale-line gold">Happy Birthday, my love. ❤️</p>
        <p className="finale-line">Until I can celebrate your birthdays beside you,</p>
        <p className="finale-line">I&apos;ll keep finding little ways to be there.</p>
        <p className="finale-line">I love you.</p>

        <button
          className={`finale-btn ${showFinal ? "hidden-away" : ""}`}
          id="finaleBtn"
          onClick={() => setShowFinal(true)}
        >
          One last thing...
        </button>

        <div className={`finale-final-msg ${showFinal ? "show" : ""}`} id="finaleFinalMsg">
          <p>
            Whatever today looked like from far away — I hope you felt, even for a moment, exactly as loved as you
            are. See you soon. Really. — timro baccha
          </p>
        </div>
      </div>
    </section>
  );
}
