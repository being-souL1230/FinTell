import { AI_SAFETY_NOTICE, searchKnowledgeBase } from "@/lib/knowledge-base";

const SENSITIVE_PATTERNS = [
  /\botp\b/i,
  /\bpin\b/i,
  /\bcvv\b/i,
  /\bpassword\b/i,
  /\bcard number\b/i,
  /\baccount number\b/i,
];

export type AiAnswer = {
  answer: string;
  source: "knowledge_base" | "llm" | "fallback" | "blocked";
};

function looksLikeCredentialRequest(message: string) {
  const lower = message.toLowerCase();
  return (
    SENSITIVE_PATTERNS.some((p) => p.test(lower)) &&
    /(share|send|batao|dedo|de do|tell me|what is my|mera)/i.test(lower)
  );
}

export async function callGroqLlm(
  prompt: string,
  systemPrompt?: string,
  temperature = 0.2,
  maxTokens = 650
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY || "";
  const models = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "groq/compound"];

  const sysMsg =
    systemPrompt ||
    `You are FinTell's Lead AI Financial Advisor and Literacy Assistant.

CRITICAL SCOPE GUARDRAIL:
You are ONLY allowed to answer questions related to personal finance, banking, budgeting, savings, investments, debt/loans, GST, business accounting, shopkeeper reconciliation, and cyber/financial fraud safety.
If the user asks about ANYTHING ELSE (e.g. movies, sports, weather, coding/programming, recipes, video games, general trivia, politics, entertainment, geography), you MUST STRICTLY REFUSE and reply ONLY with:
"I am FinTell's specialized Financial Assistant. I can only assist with finance, banking, money management, budget, debt, and fraud safety questions. Please ask a financial or money-related question!"

KEY FORMATTING RULES:
1. Format all financial responses cleanly in Markdown with bold key terms (**term**), subheadings (### Header), and bullet points (- point).
2. Never request or accept sensitive credentials (OTP, PIN, CVV, Passwords).
3. Provide objective financial education in easy-to-understand language.
4. Keep answers concise, actionable, and structured.`;

  for (const model of models) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: sysMsg },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) continue;
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content === "string" && content.trim().length > 0) {
        return content.trim();
      }
    } catch {
      continue;
    }
  }

  return null;
}

export async function getAiAnswer(question: string): Promise<AiAnswer> {
  const trimmed = question.trim();

  if (!trimmed) {
    return {
      answer: "Please type your question — for example, 'What is a Fixed Deposit (FD)?' or 'When should I enter my UPI PIN?'",
      source: "fallback",
    };
  }

  if (looksLikeCredentialRequest(trimmed)) {
    return {
      answer:
        "I never ask for or share sensitive details like your **OTP, PIN, CVV, password, or account numbers**. These must remain strictly between you and your bank.\n\n" +
        AI_SAFETY_NOTICE,
      source: "blocked",
    };
  }

  const llmAnswer = await callGroqLlm(trimmed);
  if (llmAnswer) {
    return { answer: `${llmAnswer}\n\n_${AI_SAFETY_NOTICE}_`, source: "llm" };
  }

  const kbMatch = searchKnowledgeBase(trimmed);
  if (kbMatch) {
    return { answer: `${kbMatch.answer}\n\n_${AI_SAFETY_NOTICE}_`, source: "knowledge_base" };
  }

  return {
    answer:
      "I do not have specific information on this topic yet. You can explore lessons under Banking Basics, UPI, ATM Safety, Savings, Loans, and Digital Safety in the 'Learn' section, or search terms in the glossary.\n\n" +
      AI_SAFETY_NOTICE,
    source: "fallback",
  };
}
