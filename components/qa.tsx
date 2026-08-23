"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ensureVisitId } from "@/lib/client/visit";

const QUESTIONS = [
  "If we could teleport anywhere together tonight, where would we go?",
  "What's one thing you'd change about me? Be honest, I can take it.",
  "What's something small I do that makes you smile without me even trying?",
  "What's your favorite thing I call you? Should I use it more?",
  "What's your favorite memory of us so far?",
  "What's one thing you want me to promise you?",
  "What's something about you I might not fully understand yet, that you wish I did?",
  "What's one thing about us you never want to change?",
  "What's a tiny everyday moment you're most looking forward to sharing with me someday?",
];

const qaFormSchema = z.object({
  answers: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string().trim().min(1, "Write a little something first ❤️").max(5000),
      })
    )
    .length(QUESTIONS.length),
});

type QAFormValues = z.infer<typeof qaFormSchema>;

export default function QA() {
  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors },
  } = useForm<QAFormValues>({
    resolver: zodResolver(qaFormSchema),
    defaultValues: {
      answers: QUESTIONS.map((q) => ({ question: q, answer: "" })),
    },
  });

  const [current, setCurrent] = useState<number | "summary">(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<null | boolean>(null);
  const inputRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  const answers = useWatch({ control, name: "answers" });

  useEffect(() => {
    if (current !== "summary") {
      inputRefs.current[current]?.focus({ preventScroll: true });
    }
  }, [current]);

  const handleNext = async (idx: number) => {
    const ok = await trigger(`answers.${idx}.answer`);
    if (!ok) return;
    if (idx === QUESTIONS.length - 1) {
      setCurrent("summary");
    } else {
      setCurrent(idx + 1);
    }
  };

  const handleBack = (idx: number) => {
    setCurrent(idx - 1);
  };

  const onSubmit = async (values: QAFormValues) => {
    setSaving(true);
    setSaved(null);
    try {
      const visitId = await ensureVisitId();
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitId, answers: values.answers }),
      });
      if (!res.ok) throw new Error("save failed");
      setSaved(true);
    } catch {
      setSaved(false);
    } finally {
      setSaving(false);
    }
  };

  const downloadAnswers = () => {
    const lines = answers
      .map((a) => `${a.question}\n${a.answer || "(no answer)"}\n`)
      .join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "our-little-conversation.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasErrors = Object.keys(errors.answers ?? {}).length > 0;

  return (
    <section id="qa">
      <div className="qa-frame">
        <p className="letter-eyebrow" style={{ textAlign: "center" }}>
          a little conversation
        </p>
        <div className="qa-progress" id="qaProgress">
          {QUESTIONS.map((_, i) => (
            <span
              key={i}
              className={`qa-dot ${current === "summary" || i < (current as number) ? "done" : ""} ${
                current === i ? "current" : ""
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {QUESTIONS.map((q, i) => {
            const { ref, ...field } = register(`answers.${i}.answer`);
            const errorMsg = errors.answers?.[i]?.answer?.message;
            const filled = (answers[i]?.answer ?? "").trim().length > 0;
            return (
              <div key={q} className={`qa-step ${current === i ? "active" : ""}`} data-index={i}>
                <p className="qa-question">{q}</p>
                <textarea
                  className={`qa-input ${errorMsg ? "error" : ""}`}
                  rows={2}
                  placeholder="type your answer..."
                  {...field}
                  ref={(el) => {
                    ref(el);
                    inputRefs.current[i] = el;
                  }}
                />
                {errorMsg && <p className="qa-error">{errorMsg}</p>}
                <div className="qa-actions">
                  {i > 0 && (
                    <button type="button" className="qa-btn ghost" onClick={() => handleBack(i)}>
                      Back
                    </button>
                  )}
                  <button type="button" className="qa-btn primary" onClick={() => handleNext(i)} disabled={!filled}>
                    {i === QUESTIONS.length - 1 ? "See it all ❤️" : "Next ❤️"}
                  </button>
                </div>
              </div>
            );
          })}

          <div className={`qa-step ${current === "summary" ? "active" : ""}`} id="qaSummaryStep">
            <p className="qa-question">Our little conversation</p>
            <div className="qa-summary-list" id="qaSummaryList">
              {answers.map((a) => (
                <div key={a.question}>
                  <p className="qa-summary-q">{a.question}</p>
                  <p className="qa-summary-a">{a.answer || "no answer yet"}</p>
                </div>
              ))}
            </div>
            <div className="qa-actions">
              <button
                type="button"
                className="qa-btn ghost"
                onClick={() => setCurrent(QUESTIONS.length - 1)}
              >
                Edit
              </button>
              <button type="submit" className="qa-btn primary" id="qaDownloadBtn" disabled={saving}>
                {saving ? "Saving..." : "Save our answers"}
              </button>
            </div>
            {hasErrors && (
              <p className="qa-error" style={{ textAlign: "center" }}>
                Some answers are empty — tap Edit to go back and fill them in.
              </p>
            )}
            {saved === true && <p className="feeling-saved show">saved ❤️</p>}
            {saved === false && (
              <p className="qa-error" style={{ textAlign: "center" }}>
                Couldn&apos;t save right now — try again, or download a copy below.
              </p>
            )}
            <button type="button" className="qa-download-link" onClick={downloadAnswers}>
              download a copy for yourself
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
