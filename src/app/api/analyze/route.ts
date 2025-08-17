import { NextRequest } from "next/server";

type RiskScore = "Low" | "Medium" | "High";
type AnalysisResponse = {
  risk_score: RiskScore;
  scam_type: string;
  explanation: string;
  steps: string[];
  translation?: { language: string; explanation: string; steps: string[] };
  contact?: string;
};

// Lazy import to keep cold starts smaller
async function ocrImage(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const base64 = buf.toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;
  const Tesseract = await import("tesseract.js");
  const { data } = await Tesseract.recognize(dataUrl, "eng");
  return (data.text || "").trim();
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let message = "";
    let language = "en";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const img = form.get("image");
      const lang = form.get("language");
      if (typeof lang === "string") language = lang;
      if (img instanceof File) {
        message = await ocrImage(img);
      }
    } else {
      const body = await req.json().catch(() => ({}));
      message = (body?.message as string) || "";
      language = (body?.language as string) || "en";
    }

    if (!message || !message.trim()) {
      return new Response(JSON.stringify({ error: "Empty message" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const upstream = await fetch(
      "https://backendfinguard-746989509626.asia-southeast2.run.app/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, language }),
      }
    );
    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: `Upstream error ${upstream.status}` }), {
        status: 502,
        headers: { "content-type": "application/json" },
      });
    }
    const data = (await upstream.json()) as AnalysisResponse;
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
