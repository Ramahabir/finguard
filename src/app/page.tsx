"use client";
import { useId, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

type RiskScore = "Low" | "Medium" | "High";
type AnalysisResponse = {
  risk_score: RiskScore;
  scam_type: string;
  explanation: string;
  steps: string[];
  translation?: {
    language: string;
    explanation: string;
    steps: string[];
  };
  contact?: string;
};

const LANGUAGES = [
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ms", label: "Bahasa Melayu" },
  { code: "th", label: "ไทย (Thai)" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "tl", label: "Filipino" },
  { code: "my", label: "မြန်မာ (Burmese)" },
  { code: "km", label: "ភាសាខ្មែរ (Khmer)" },
  { code: "lo", label: "ລາວ (Lao)" },
  { code: "en", label: "English" },
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  const msgId = useId();
  const scoreBadge = useMemo(() => {
    if (!result) return null;
    const color =
      result.risk_score === "High"
        ? "bg-red-100 text-red-700 border-red-200"
        : result.risk_score === "Medium"
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-emerald-100 text-emerald-700 border-emerald-200";
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${color}`}>
        Risk: {result.risk_score}
      </span>
    );
  }, [result]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!message.trim()) {
      setError("Please paste or type a message to analyze.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://backendfinguard-746989509626.asia-southeast2.run.app/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, language: lang }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data: AnalysisResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(
        "We couldn't analyze the message right now. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
      <div className="mx-auto mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          FinGuard SEA
        </h1>
        <p className="mt-2 text-sm text-foreground/70">
          Paste a suspicious message and get an instant risk check with plain-language tips.
        </p>
      </div>

      <section
        aria-label="Scam checker"
        className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 backdrop-blur shadow-lg"
      >
        <form onSubmit={onSubmit} className="p-5 sm:p-6">
          <label htmlFor={msgId} className="block text-sm font-medium mb-2">
            Suspicious message
          </label>
          <textarea
            id={msgId}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste the SMS, WhatsApp, email, or social message here..."
            rows={6}
            className="w-full resize-y rounded-xl border border-black/10 dark:border-white/15 bg-background/80 p-3 text-sm outline-none ring-2 ring-transparent focus:ring-blue-500/30"
            aria-invalid={!!error}
            aria-describedby={error ? `${msgId}-error` : undefined}
            required
          />

          <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="grow">
              <label className="block text-xs font-medium mb-1" htmlFor="lang">
                Output language
              </label>
              <select
                id="lang"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full sm:w-60 rounded-lg border border-black/10 dark:border-white/15 bg-background/80 p-2 text-sm"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:ml-auto">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60"
                aria-live="polite"
              >
                {loading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                    Checking…
                  </>
                ) : (
                  "Check Message"
                )}
              </button>
            </div>
          </div>

          {error && (
            <p id={`${msgId}-error`} className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}
        </form>

        {result && (
          <div className="border-t border-black/5 dark:border-white/10 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              {scoreBadge}
              <span className="text-xs sm:text-sm text-foreground/70">
                {result.scam_type}
              </span>
            </div>

            <h2 className="mt-3 text-lg font-semibold">Why this might be a scam</h2>
            <p className="mt-1 text-sm leading-6 whitespace-pre-line">
              <ReactMarkdown>{result.explanation}</ReactMarkdown>
            </p>

            {result.steps?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium">What you can do</h3>
                <ol className="mt-2 list-decimal pl-5 text-sm space-y-1">
                  {result.steps.slice(0, 3).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
            )}

            {result.translation && (
              <div className="mt-6 rounded-xl bg-black/5 dark:bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    Translation ({result.translation.language})
                  </h3>
                </div>
                <p className="mt-2 text-sm whitespace-pre-line">
                  {result.translation.explanation}
                </p>
                {result.translation.steps?.length > 0 && (
                  <ol className="mt-2 list-decimal pl-5 text-sm space-y-1">
                    {result.translation.steps.slice(0, 3).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                )}
              </div>
            )}

            {result.contact && (
              <div className="mt-6">
                <h3 className="text-sm font-medium">Report or get help</h3>
                <p className="text-sm text-foreground/80">{result.contact}</p>
              </div>
            )}
          </div>
        )}
      </section>

      <p className="mt-6 text-center text-xs text-foreground/60">
        Disclaimer: This tool provides guidance only and may not detect all scams.
      </p>
    </main>
  );
}
