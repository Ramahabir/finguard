"use client";
import { useEffect, useRef, useState } from "react";

type RiskScore = "Low" | "Medium" | "High";

type AnalysisResponse = {
  risk_score: RiskScore;
  scam_type: string;
  explanation: string;
  steps: string[];
  translation?: { language: string; explanation: string; steps: string[] };
  contact?: string;
};

export type ChatbotProps = {
  open: boolean;
  onClose: () => void;
  language?: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function Chatbot({ open, onClose, language = "en" }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I’m FinGuard Assistant. Paste any suspicious message and I’ll check its risk and explain why.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      // slight delay to allow modal to paint before focusing
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language }),
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data: AnalysisResponse = await res.json();
      const reply = makeAssistantReply(data);
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: reply },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, I couldn’t analyze that just now. Please try again. If this is urgent, avoid clicking links and contact your local hotline.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function makeAssistantReply(d: AnalysisResponse) {
    const tips = (d.translation?.steps ?? d.steps ?? []).slice(0, 3);
    const expl = d.translation?.explanation || d.explanation;
    const parts = [
      `Risk: ${d.risk_score}${d.scam_type ? ` · ${d.scam_type}` : ""}`,
      expl,
      tips.length ? `Tips:\n- ${tips.join("\n- ")}` : "",
      d.contact ? `Contact: ${d.contact}` : "",
    ].filter(Boolean);
    return parts.join("\n\n");
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="FinGuard chat"
      className="fixed inset-0 z-50"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <button
        aria-label="Close chat"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute bottom-4 right-4 w-[min(92vw,420px)] min-h-[400px] max-h-[80vh] rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/60 backdrop-blur shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            <h2 className="text-sm font-semibold">FinGuard Assistant</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-3 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
              <div
                className={
                  "inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm " +
                  (m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-black/5 dark:bg-white/10 text-foreground")
                }
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-left">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-black/5 dark:bg-white/10 px-3 py-2 text-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/60" />
                Thinking…
              </div>
            </div>
          )}
        </div>

        <form
          className="border-t border-black/5 dark:border-white/10 p-3 flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <label htmlFor="chat-input" className="sr-only">
            Type your message
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste the suspicious message…"
            rows={1}
            className="min-h-10 max-h-24 flex-1 resize-y rounded-xl border border-black/10 dark:border-white/15 bg-background/80 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-50"
            aria-label="Send"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
