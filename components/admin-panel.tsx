"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export interface AdminData {
  visits: Record<string, unknown>[];
  answers: Record<string, unknown>[];
  feelings: Record<string, unknown>[];
}

const VISIT_FIELDS: { key: string; label: string }[] = [
  { key: "created_at", label: "Time" },
  { key: "ip", label: "IP" },
  { key: "country", label: "Country" },
  { key: "city", label: "City" },
  { key: "device_type", label: "Device" },
  { key: "browser", label: "Browser" },
  { key: "os", label: "OS" },
];

function fmt(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

function fmtDate(value: string): string {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function AdminPanel({ initialData }: { initialData: AdminData }) {
  const router = useRouter();
  const [data, setData] = useState<AdminData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("scroll-locked");
    document.body.classList.remove("scroll-locked");
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/data", { cache: "no-store" });
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await createSupabaseBrowserClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="admin-wrap">
      <h1>the little database</h1>
      <p className="admin-sub">every visit, every answer, every feeling — right here.</p>

      <div className="admin-actions">
        <button className="qa-btn primary" onClick={refresh} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
        <button className="qa-btn ghost" onClick={logout}>
          Log out
        </button>
      </div>

      {error && <p className="admin-error">Error: {error}</p>}

      <div className="admin-panel">
        <h2>Visits ({data.visits.length})</h2>
        <table className="admin-table">
          <thead>
            <tr>
              {VISIT_FIELDS.map((f) => (
                <th key={f.key}>{f.label}</th>
              ))}
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {data.visits.map((v) => (
              <tr key={v.id as string}>
                {VISIT_FIELDS.map((f) => (
                  <td key={f.key} className="mono">
                    {f.key === "created_at" ? fmtDate(v[f.key] as string) : fmt(v[f.key])}
                  </td>
                ))}
                <td>
                  <details>
                    <summary>all metadata</summary>
                    <pre>{JSON.stringify(v, null, 2)}</pre>
                  </details>
                </td>
              </tr>
            ))}
            {data.visits.length === 0 && (
              <tr>
                <td colSpan={8}>No visits yet — once she clicks &quot;Start the journey&quot;, a row appears here.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-panel">
        <h2>Answers ({data.answers.length})</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Question</th>
              <th>Answer</th>
            </tr>
          </thead>
          <tbody>
            {data.answers.map((a) => (
              <tr key={a.id as string}>
                <td className="mono">{fmtDate(a.created_at as string)}</td>
                <td>{a.question as string}</td>
                <td>{a.answer as string}</td>
              </tr>
            ))}
            {data.answers.length === 0 && (
              <tr>
                <td colSpan={3}>No answers saved yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-panel">
        <h2>Feelings ({data.feelings.length})</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Feeling</th>
            </tr>
          </thead>
          <tbody>
            {data.feelings.map((f) => (
              <tr key={f.id as string}>
                <td className="mono">{fmtDate(f.created_at as string)}</td>
                <td>{f.text as string}</td>
              </tr>
            ))}
            {data.feelings.length === 0 && (
              <tr>
                <td colSpan={2}>No feelings saved yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
