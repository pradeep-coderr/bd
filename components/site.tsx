"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Landing from "./landing";
import Reveal from "./reveal";
import LocationShare from "./location-share";
import Letter from "./letter";
import Memories from "./memories";
import Love from "./love";
import Distance from "./distance";
import IfThere from "./ifthere";
import QA from "./qa";
import Feeling from "./feeling";
import BucketList from "./bucketlist";
import Finale from "./finale";
import CoupleDivider from "./couple-art";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function Site() {
  const router = useRouter();
  const [revealActive, setRevealActive] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const isLocked = () => root.classList.contains("scroll-locked");
    const blockKeys = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Space", " ", "End", "Home"]);

    const onWheel = (e: WheelEvent) => {
      if (isLocked()) e.preventDefault();
    };
    const onTouch = (e: TouchEvent) => {
      if (isLocked()) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (isLocked() && blockKeys.has(e.key)) e.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchmove", onTouch, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const unlock = () => {
    document.documentElement.classList.remove("scroll-locked");
    document.body.classList.remove("scroll-locked");
    window.scrollTo({ top: 0, behavior: "auto" });
    setRevealActive(true);
  };

  return (
    <>
      <Landing onUnlocked={unlock} />
      <Reveal active={revealActive} />
      <LocationShare />
      <CoupleDivider scene="hold-hands" />
      <Letter />
      <CoupleDivider scene="hug" />
      <Memories />
      <CoupleDivider scene="laughing" />
      <Love />
      <CoupleDivider scene="kissing" />
      <Distance />
      <CoupleDivider scene="spark-hearts" />
      <IfThere />
      <CoupleDivider scene="dancing" />
      <QA />
      <CoupleDivider scene="celebrating" />
      <Feeling />
      <CoupleDivider scene="coffee-date" />
      <BucketList />
      <CoupleDivider scene="sunset-bench" />
      <Finale />
      <div className="signout-wrap">
        <button
          type="button"
          className="qa-download-link"
          onClick={async () => {
            await createSupabaseBrowserClient().auth.signOut();
            router.replace("/login");
            router.refresh();
          }}
        >
          sign out
        </button>
      </div>
    </>
  );
}
