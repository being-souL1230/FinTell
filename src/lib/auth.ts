import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { moneyProfiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";

const COOKIE_NAME = "fintell_session";
const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "fintell-fallback-secret-do-not-use-in-prod",
);

export type SessionPayload = {
  userId: number;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionCookie(userId: number) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionPayload(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.userId !== "number") return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSessionPayload();
  if (!session) return null;
  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  return user ?? null;
}

/** Ensures a guest user exists and returns it. */
export async function getOrCreateGuestUser(language?: string) {
  const GUEST_EMAIL = "guest@fintell.app";
  const ensureDefaultProfile = async (userId: number) => {
    const [profile] = await db.select().from(moneyProfiles).where(eq(moneyProfiles.userId, userId)).limit(1);
    if (!profile) {
      await db.insert(moneyProfiles).values({
        userId,
        monthlyIncome: 20000,
        fixedExpenses: 9000,
        variableExpenses: 5000,
        existingDebtEmi: 0,
        savingsGoalName: "Emergency fund",
        savingsGoalAmount: 30000,
        currentSavings: 7500,
        preferredMonthlySaving: 2500,
        monthlyFinancialGoal: "emergency_fund",
        bufferPreference: 55,
      });
    }
  };

  const [existing] = await db.select().from(users).where(eq(users.email, GUEST_EMAIL)).limit(1);
  if (existing) {
    await ensureDefaultProfile(existing.id);
    if (language && ["hi", "en", "mr", "ta", "bn", "te", "gu", "pa", "kn", "ml", "or"].includes(language)) {
      await db.update(users).set({ language: language as "hi" | "en" }).where(eq(users.id, existing.id));
    }
    return existing;
  }

  const hash = await hashPassword("GuestAccess@2024");
  const [guest] = await db
    .insert(users)
    .values({
      name: "Guest User",
      email: GUEST_EMAIL,
      passwordHash: hash,
      role: "user",
      language: (language && ["hi", "en", "mr", "ta", "bn", "te", "gu", "pa", "kn", "ml", "or"].includes(language)
        ? language
        : "en") as "hi" | "en",
      experienceLevel: "new",
      onboarded: true,
      xp: 0,
    })
    .returning();
  await ensureDefaultProfile(guest.id);
  return guest;
}
