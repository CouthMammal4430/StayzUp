import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StayzUp - Tracker d'habitudes avec Gamification",
  description: "Développez vos habitudes avec un système de gamification complet. Gagnez de l'XP, suivez vos streaks et progressez vers vos objectifs.",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

