import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { getLangFromCookie, LANG_COOKIE } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FinTell | AI Financial Guardian & Smart Money Companion",
  description:
    "FinTell helps first-time bank account holders learn banking, simulate financial decisions, manage debt, and spot scams safely.",
  icons: {
    icon: "/fintell-logo.png",
    shortcut: "/fintell-logo.png",
    apple: "/fintell-logo.png",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const lang = getLangFromCookie(cookieStore.get(LANG_COOKIE)?.value);

  return (
    <html lang={lang} data-scroll-behavior="smooth">
      <body className={`${inter.className} bg-[#fcfdf6] text-slate-900 antialiased`}>{children}</body>
    </html>
  );
}
