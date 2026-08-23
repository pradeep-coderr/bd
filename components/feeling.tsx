"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ensureVisitId } from "@/lib/client/visit";

const feelingFormSchema = z.object({
  text: z.string().trim().min(1, "Write something first ❤️").max(2000),
});

type FeelingFormValues = z.infer<typeof feelingFormSchema>;

export default function Feeling() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeelingFormValues>({
    resolver: zodResolver(feelingFormSchema),
    defaultValues: { text: "" },
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<null | boolean>(null);

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
      if (!res.ok) throw new Error("save failed");
      setSaved(true);
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
        <p className="feeling-hint">
          Whatever&apos;s on your mind — how this feels, what you&apos;re thinking, anything you want more of from me.
          This is just for you to write, no pressure to say the &quot;right&quot; thing.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            className={`qa-input ${errors.text ? "error" : ""}`}
            id="feelingInput"
            rows={4}
            placeholder="type as much or as little as you want..."
            {...register("text")}
          />
          {errors.text && <p className="qa-error">{errors.text.message}</p>}
          <div className="qa-actions">
            <button type="submit" className="qa-btn primary" id="feelingSaveBtn" disabled={saving}>
              {saving ? "Saving..." : "Save what I wrote"}
            </button>
          </div>
        </form>
        <p className={`feeling-saved ${saved === true ? "show" : ""} ${saved === false ? "error show" : ""}`}>
          {saved === false ? "couldn't save — try again" : "saved ❤️"}
        </p>
      </div>
    </section>
  );
}
