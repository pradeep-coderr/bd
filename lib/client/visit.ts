"use client";

import { collectClientMeta } from "./metadata";
import { getPreciseLocation } from "./geo";

const VISIT_KEY = "bd_visit_id";

async function postGeo(visitId: string) {
  try {
    const geo = await getPreciseLocation();
    if (!geo) return;
    await fetch("/api/visit/geo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitId, ...geo }),
    });
  } catch {}
}

export async function postVisit(): Promise<string | null> {
  try {
    const res = await fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await collectClientMeta()),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const id: string | null = data?.id ?? null;
    if (id) {
      try {
        localStorage.setItem(VISIT_KEY, id);
      } catch {}
      postGeo(id).catch(() => {});
    }
    return id;
  } catch {
    return null;
  }
}

export function getVisitId(): string | null {
  try {
    return localStorage.getItem(VISIT_KEY);
  } catch {
    return null;
  }
}

export async function ensureVisitId(): Promise<string | null> {
  const existing = getVisitId();
  if (existing) return existing;
  const id = await postVisit();
  if (id) {
    try {
      localStorage.setItem(VISIT_KEY, id);
    } catch {}
  }
  return id;
}
