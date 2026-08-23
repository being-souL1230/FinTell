import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ModeProvider } from "@/components/ModeContext";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.onboarded) redirect("/onboarding");

  return (
    <ModeProvider>
      <div className="min-h-screen bg-[#f8faf7]">
        <Sidebar isAdmin={user.role === "admin"} name={user.name} hasBusiness={user.hasBusiness || user.role === "admin"} />
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <Header userName={user.name} hasBusiness={user.hasBusiness || user.role === "admin"} />

          <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
          </main>
        </div>
      </div>
    </ModeProvider>
  );
}
