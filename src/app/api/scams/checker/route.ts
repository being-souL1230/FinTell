import { NextResponse } from "next/server";
import { z } from "zod";
import { callGroqLlm } from "@/lib/ai-service";

const schema = z.object({ query: z.string().trim().min(1).max(1000) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a link, message, or UPI ID to analyze" }, { status: 400 });
  }

  const query = parsed.data.query;
  const lower = query.toLowerCase();

  let type: "UPI_ID" | "LINK" | "MESSAGE" | "UNKNOWN" = "MESSAGE";
  if (lower.includes("@upi") || lower.includes("@ok") || lower.includes("@paytm") || lower.includes("@ybl")) {
    type = "UPI_ID";
  } else if (lower.includes("http://") || lower.includes("https://") || lower.includes("www.") || lower.includes(".com/") || lower.includes(".top/") || lower.includes(".xyz/")) {
    type = "LINK";
  }

  const prompt = `Analyze this suspicious item for financial fraud risk:
Query: "${query}"
Query Type: ${type}

Perform a rigorous security evaluation and respond strictly in JSON format with these exact keys:
{
  "riskScore": number (between 0 for completely safe to 100 for severe scam/phishing),
  "riskLevel": "CRITICAL_FRAUD" | "SUSPICIOUS" | "LIKELY_SAFE",
  "redFlags": ["red flag 1", "red flag 2"],
  "safePoints": ["safe point 1"],
  "recommendation": "Clear, bold action recommendation."
}`;

  const sysPrompt = "You are FinTell's AI Cyber Fraud & Anti-Phishing Security Scanner. You evaluate incoming SMS messages, Telegram job links, website URLs, and UPI VPA IDs to detect fraud, impersonation, and phishing scams. Respond ONLY with valid JSON.";

  const aiRaw = await callGroqLlm(prompt, sysPrompt, 0.1, 500);

  if (aiRaw) {
    try {
      const jsonMatch = aiRaw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedJson = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          query,
          type,
          riskScore: parsedJson.riskScore ?? 50,
          riskLevel: parsedJson.riskLevel ?? "SUSPICIOUS",
          redFlags: parsedJson.redFlags ?? [],
          safePoints: parsedJson.safePoints ?? [],
          recommendation: parsedJson.recommendation ?? "Verify independently before proceeding.",
          source: "groq_ai",
        });
      }
    } catch {
      // Fallback to deterministic evaluation
    }
  }

  // Deterministic fallback evaluation if API is offline
  let riskScore = 20;
  let riskLevel: "CRITICAL_FRAUD" | "SUSPICIOUS" | "LIKELY_SAFE" = "LIKELY_SAFE";
  const redFlags: string[] = [];
  const safePoints: string[] = [];
  let recommendation = "Verify the recipient or source through official channels before sending money.";

  if (type === "UPI_ID" && (lower.includes("claim") || lower.includes("win") || lower.includes("reward") || lower.includes("cashback"))) {
    riskScore = 92;
    riskLevel = "CRITICAL_FRAUD";
    redFlags.push("VPA contains scam keywords ('claim', 'win', 'reward') commonly used in UPI cashback traps.");
    recommendation = "DO NOT PAY or enter your UPI PIN. You NEVER need a PIN to RECEIVE money.";
  } else if (type === "LINK" && (lower.includes(".top") || lower.includes(".xyz") || lower.includes("earn") || !lower.startsWith("https://"))) {
    riskScore = 95;
    riskLevel = "CRITICAL_FRAUD";
    redFlags.push("Unsecure protocol (HTTP) or suspicious top-level domain (.top / .xyz).");
    recommendation = "DO NOT CLICK this link. Block the sender immediately to prevent phishing or credential theft.";
  } else if (type === "MESSAGE" && (lower.includes("disconnect") || lower.includes("unpaid bill") || lower.includes("kyc expired"))) {
    riskScore = 88;
    riskLevel = "CRITICAL_FRAUD";
    redFlags.push("Urgency threat tactic ('disconnected tonight') designed to induce immediate panic.");
    recommendation = "This is an Impersonation Fraud. Ignore the message and contact official customer service.";
  } else {
    safePoints.push("No explicit high-risk panic keywords detected.");
  }

  return NextResponse.json({
    query,
    type,
    riskScore,
    riskLevel,
    redFlags,
    safePoints,
    recommendation,
    source: "heuristic",
  });
}
