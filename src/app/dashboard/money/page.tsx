import { db } from "@/db";
import { moneyProfiles, monthlyMoneyProgress } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, asc } from "drizzle-orm";
import { SectionHeader } from "@/components/ui";
import { PersonalMoneyCoach } from "@/components/dashboard/PersonalMoneyCoach";

export const dynamic = "force-dynamic";

export default async function MoneyPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [profile] = await db.select().from(moneyProfiles).where(eq(moneyProfiles.userId, user.id)).limit(1);
  const progress = await db
    .select()
    .from(monthlyMoneyProgress)
    .where(eq(monthlyMoneyProgress.userId, user.id))
    .orderBy(asc(monthlyMoneyProgress.monthKey));

  return (
    <div className="space-y-3.5">
      <SectionHeader
        title="My Money Coach"
        subtitle="Track money, manage goals and learn safe financial choices."
      />
      <PersonalMoneyCoach initialProfile={profile ?? null} initialProgress={progress} />
    </div>
  );
}
