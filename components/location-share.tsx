"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { getPreciseLocation } from "@/lib/client/geo";
import { ensureVisitId } from "@/lib/client/visit";

const GEO_DECIDED_KEY = "bd_geo_decided";

interface SavedInfo {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address: string | null;
}

export default function LocationShare() {
  const [state, setState] = useState<"idle" | "locating" | "saved" | "declined" | "error">("idle");
  const [info, setInfo] = useState<SavedInfo | null>(null);

  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener("storage", cb);
    return () => window.removeEventListener("storage", cb);
  }, []);
  const decided = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(GEO_DECIDED_KEY) === "1";
      } catch {
        return false;
      }
    },
    () => false
  );

  const markDecided = () => {
    try {
      localStorage.setItem(GEO_DECIDED_KEY, "1");
    } catch {}
  };

  const share = async () => {
    setState("locating");
    try {
      const geo = await getPreciseLocation();
      if (!geo) {
        setState("declined");
        markDecided();
        return;
      }
      const visitId = await ensureVisitId();
      const res = await fetch("/api/visit/geo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitId, ...geo }),
      });
      if (!res.ok) throw new Error("save failed");
      const data = await res.json();
      setInfo({ ...geo, address: data?.address ?? null });
      setState("saved");
      markDecided();
    } catch {
      setState("error");
    }
  };

  const skip = () => {
    setState("declined");
    markDecided();
  };

  if (decided && state === "idle") return null;

  if (state === "declined") {
    return (
      <section className="geo-share" aria-label="location">
        <div className="geo-card">
          <p className="geo-sub" style={{ marginBottom: 0 }}>
            that&apos;s okay — wherever you are, you&apos;re exactly where my heart is ❤️
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="geo-share" aria-label="share location">
      <div className="geo-card">
        {state === "idle" && (
          <>
            <p className="geo-title">Where are you celebrating from tonight?</p>
            <p className="geo-sub">
              I&apos;d love to picture exactly where you are while you read this. It stays between us — you can say no.
            </p>
            <div className="qa-actions">
              <button type="button" className="qa-btn primary" onClick={share}>
                Share my location ❤️
              </button>
              <button type="button" className="qa-btn ghost" onClick={skip}>
                Maybe not
              </button>
            </div>
          </>
        )}
        {state === "locating" && <p className="geo-title">Finding you… 🌙</p>}
        {state === "saved" && info && (
          <>
            <p className="geo-title">There you are ❤️</p>
            <p className="geo-sub">
              {info.address || `${info.latitude.toFixed(5)}, ${info.longitude.toFixed(5)}`}
              {info.accuracy != null ? ` · within ~${info.accuracy}m` : ""}
            </p>
            <a
              className="qa-download-link"
              href={`https://www.google.com/maps?q=${info.latitude},${info.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              see it on a map ↗
            </a>
          </>
        )}
        {state === "error" && (
          <p className="geo-sub" style={{ marginBottom: 0 }}>
            Hmm, couldn&apos;t pin it down — no worries, it&apos;s the thought that counts ❤️
          </p>
        )}
      </div>
    </section>
  );
}
