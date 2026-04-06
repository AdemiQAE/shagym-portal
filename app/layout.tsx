import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Шағым — Азаматтық өтініштер порталы",
  description: "Тұрғындардың өтініштерін қабылдау және қадағалау веб-порталы. Мэрияға арыз беріңіз.",
  keywords: ["арыз", "шағым", "жалоба", "мэрия", "Казахстан", "гражданские обращения"],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  const session = await auth();
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "kz";

  return (
    <html lang={locale === "kz" ? "kk" : "ru"} suppressHydrationWarning>
      <head>
      </head>
      <body>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <Header session={session} locale={locale} />
            <main className="page">
              {children}
            </main>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
