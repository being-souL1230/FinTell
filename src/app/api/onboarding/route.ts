import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionPayload } from "@/lib/auth";
import { LANG_COOKIE, type LangCode } from "@/lib/i18n";

const schema = z.object({
  language: z.enum(["hi", "en", "mr", "ta", "bn", "te", "gu", "pa", "kn", "ml", "or"]),
  experienceLevel: z.enum(["new", "some", "basic"]),
  hasBusiness: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await db
    .update(users)
    .set({
      language: parsed.data.language,
      experienceLevel: parsed.data.experienceLevel,
      hasBusiness: parsed.data.hasBusiness,
      onboarded: true,
    })
    .where(eq(users.id, session.userId));

  const response = NextResponse.json({ ok: true });
  response.cookies.set(LANG_COOKIE, parsed.data.language as LangCode, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
