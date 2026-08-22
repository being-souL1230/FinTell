import { NextResponse } from "next/server";
import { createSessionCookie, getOrCreateGuestUser } from "@/lib/auth";
import { getLangFromCookie, LANG_COOKIE } from "@/lib/i18n";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const requestedLang = body?.language as string | undefined;
  const lang = getLangFromCookie(requestedLang);

  const guest = await getOrCreateGuestUser(lang);
  await createSessionCookie(guest.id);

  const response = NextResponse.json({
    user: { id: guest.id, name: guest.name, email: guest.email, onboarded: guest.onboarded },
  });
  response.cookies.set(LANG_COOKIE, lang, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
