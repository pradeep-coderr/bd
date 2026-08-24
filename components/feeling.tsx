"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ensureVisitId } from "@/lib/client/visit";

const FEELING_LOCK_KEY = "bd_feeling_saved";

const feelingFormSchema = z.object({
  text: z.string().trim().min(1, "Write something first ❤️").max(2000),
});

type FeelingFormValues = z.infer<typeof feelingFormSchema>;

export default function Feeling() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FeelingFormValues>({
    resolver: zodResolver(feelingFormSchema),
    defaultValues: { text: "" },
  });

  const text = useWatch({ control, name: "text" });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<null | boolean>(null);

  const subscribeLock = useCallback((cb: () => void) => {
    window.addEventListener("storage", cb);
    return () => window.removeEventListener("storage", cb);
  }, []);
  const locked = useSyncExternalStore(
    subscribeLock,
    () => {
      try {
        return localStorage.getItem(FEELING_LOCK_KEY) === "1";
      } catch {
        return false;
      }
    },
    () => false
  );

  const onSubmit = async (values: FeelingFormValues) => {
    setSaving(true);
    setSaved(null);
    try {
      const visitId = await ensureVisitId();
      const res = await fetch("/api/feeling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitId, text: values.text }),
      });
      if (res.status === 409) {
        setSaved(true);
        try {
          localStorage.setItem(FEELING_LOCK_KEY, "1");
        } catch {}
        return;
      }
      if (!res.ok) throw new Error("save failed");
      setSaved(true);
      try {
        localStorage.setItem(FEELING_LOCK_KEY, "1");
      } catch {}
      reset({ text: "" });
    } catch {
      setSaved(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="feeling">
      <div className="qa-frame">
        <p className="letter-eyebrow">before you keep going</p>
        <p className="qa-question">How are you feeling right now?</p>
        {locked ? (
          <p className="qa-locked-note">
            You already shared how you felt with me — it&apos;s final and safe ❤️
          </p>
        ) : (
          <>
            <p className="feeling-hint">
              Whatever&apos;s on your mind — how this feels, what you&apos;re thinking, anything you want more of from
              me. This is just for you to write, no pressure to say the &quot;right&quot; thing.
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <textarea
                className={`qa-input ${errors.text ? "error" : ""}`}
                id="feelingInput"
                rows={4}
                placeholder="type as much or as little as you want..."
                {...register("text")}
                disabled={saved === true}
              />
                {errors.text && <p className="qa-error">{errors.text.message}</p>}
                <p className="qa-char-count">{(text ?? "").length}/2000</p>
              <div className="qa-actions">
                <button type="submit" className="qa-btn primary" id="feelingSaveBtn" disabled={saving || saved === true}>
                  {saving ? "Saving..." : saved === true ? "Saved ❤️" : "Save what I wrote"}
                </button>
              </div>
            </form>
            {saved === true && (
              <p className="qa-locked-note">this is final now — it&apos;s safe with me ❤️</p>
            )}
            {saved === false && (
              <p className="qa-error" style={{ textAlign: "center" }}>
                couldn&apos;t save — try again
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
