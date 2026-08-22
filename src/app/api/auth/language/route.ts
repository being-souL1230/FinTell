import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionPayload } from "@/lib/auth";
import { isLangCode, LANG_COOKIE, type LangCode } from "@/lib/i18n";

const schema = z.object({ language: z.string().min(2).max(2) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !isLangCode(parsed.data.language)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  const lang = parsed.data.language as LangCode;
  const session = await getSessionPayload();
  if (session) {
    await db.update(users).set({ language: lang }).where(eq(users.id, session.userId));
  }

  const response = NextResponse.json({ ok: true, language: lang });
  response.cookies.set(LANG_COOKIE, lang, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
