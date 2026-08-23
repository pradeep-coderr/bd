"use client";

import { useCallback, useState } from "react";

export function useInView<T extends HTMLElement>() {
  const [inView, setInView] = useState(
    () => typeof window === "undefined" || typeof IntersectionObserver === "undefined"
  );

  const setRef = useCallback((el: T | null) => {
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
  }, []);

  return { setRef, inView };
}
