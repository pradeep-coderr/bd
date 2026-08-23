"use client";

import { useInView } from "@/lib/useInView";

export default function Distance() {
  const { setRef: line1Ref, inView: line1InView } = useInView<HTMLParagraphElement>();
  const { setRef: line2Ref, inView: line2InView } = useInView<HTMLParagraphElement>();
  const { setRef: visualRef, inView: visualInView } = useInView<HTMLDivElement>();

  return (
    <section id="distance">
      <p ref={line1Ref} className={`distance-line ${line1InView ? "in-view" : ""}`}>
        Right now, there are kilometers between us.
      </p>
      <p ref={line2Ref} className={`distance-line emphasis ${line2InView ? "in-view" : ""}`}>
        But somehow, you still manage to be one of the closest people to my heart.
      </p>

      <div ref={visualRef} className={`distance-visual ${visualInView ? "in-view" : ""}`}>
        <svg
          viewBox="0 0 320 60"
          width="100%"
          role="img"
          aria-label="Two points connected by a thread of light, representing the distance between us"
        >
          <line x1="20" y1="40" x2="300" y2="40" className="distance-thread" />
          <circle cx="20" cy="40" r="5" className="distance-dot pulse" />
          <circle cx="300" cy="40" r="5" className="distance-dot pulse" style={{ animationDelay: "1.3s" }} />
          <circle cx="0" cy="0" r="3" className="distance-spark" />
        </svg>
        <div className="distance-labels">
          <span>me</span>
          <span>you</span>
        </div>
      </div>
    </section>
  );
}
