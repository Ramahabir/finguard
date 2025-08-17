"use client";
import { useId, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useI18n } from "../i18n";

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

import { LANGUAGES } from "../i18n";

export default function Home() {
  const { t, lang, setLang, riskLabel } = useI18n();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    {t("risk")}: {riskLabel(result.risk_score)}
      </span>
    );
  }, [result]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!message.trim() && !imageFile) {
      setError(t("errorEmpty"));
      return;
    }
    setLoading(true);
    try {
      let res: Response;
      if (imageFile) {
        const form = new FormData();
        form.append("image", imageFile);
        form.append("language", lang);
        res = await fetch("/api/analyze", { method: "POST", body: form });
      } else {
        res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, language: lang }),
        });
      }
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data: AnalysisResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(t("errorRequest"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
      <div className="mx-auto mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-foreground/70">{t("subtitle")}</p>
      </div>

      <section
        aria-label={t("scamChecker")}
        className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 backdrop-blur shadow-lg"
      >
        <form onSubmit={onSubmit} className="p-5 sm:p-6">
          <label htmlFor={msgId} className="block text-sm font-medium mb-2">
            {t("suspiciousMessage")}
          </label>
          <textarea
            id={msgId}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("pastePlaceholder")}
            rows={6}
            className="w-full resize-y rounded-xl border border-black/10 dark:border-white/15 bg-background/80 p-3 text-sm outline-none ring-2 ring-transparent focus:ring-blue-500/30"
            aria-invalid={!!error}
            aria-describedby={error ? `${msgId}-error` : undefined}
          />

          {imageFile && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 px-3 py-2 text-xs">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <span className="truncate max-w-52">{imageFile.name}</span>
              <button
                type="button"
                onClick={() => setImageFile(null)}
                className="ml-1 rounded px-2 py-1 hover:bg-black/10 dark:hover:bg-white/10"
                aria-label={t("remove")}
              >
                {t("remove")}
              </button>
            </div>
          )}

          <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="grow">
              <label className="block text-xs font-medium mb-1" htmlFor="lang">
                {t("language")}
              </label>
              <select
                id="lang"
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
                className="w-full sm:w-60 rounded-lg border border-black/10 dark:border-white/15 bg-background/80 p-2 text-sm"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:ml-auto flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  if (f && f.size > 10 * 1024 * 1024) {
                    setError("Image is too large (max 10MB)");
                    return;
                  }
                  setError(null);
                  setImageFile(f);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center rounded-xl border border-black/10 dark:border-white/15 bg-background/80 px-3 py-2.5 text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10"
                aria-label={t("attachImage")}
                title={t("attachImage")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60"
                aria-live="polite"
              >
                {loading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                    {t("checking")}
                  </>
                ) : (
                  t("check")
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

            <h2 className="mt-3 text-lg font-semibold">{t("whyScam")}</h2>
            <p className="mt-1 text-sm leading-6 whitespace-pre-line">
              <ReactMarkdown>{result.explanation}</ReactMarkdown>
            </p>

            {result.steps?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium">{t("whatYouCanDo")}</h3>
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
                    {t("translation")} ({result.translation.language})
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
                <h3 className="text-sm font-medium">{t("reportHelp")}</h3>
                <p className="text-sm text-foreground/80">{result.contact}</p>
              </div>
            )}
          </div>
        )}
      </section>

      <p className="mt-6 text-center text-xs text-foreground/60">{t("disclaimer")}</p>
    </main>
  );
}
