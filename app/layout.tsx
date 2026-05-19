import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkAppearance } from "./lib/clerk-appearance";
import "./globals.css";
import { Header } from "./components/layout/header";
import { Footer } from "./components/layout/footer";
import { OfflineScreen } from "./components/layout/offline-screen";

// Inter — the open Helvetica clone. Replaces Plus Jakarta + DM Sans;
// it covers both display and body roles with the full weight range.
// Newsreader (serif) and JetBrains Mono stay for the insights serif
// headlines + monospace meta labels.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "MarketIQ — Capital Markets Mongolia",
  description:
    "Mongolia's premier capital markets intelligence platform. Research, data, and insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html
        lang="en"
        className={`${inter.variable} ${jetbrainsMono.variable} ${newsreader.variable} h-full antialiased`}
      >
        <body className="min-h-screen">
          <OfflineScreen />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="pt-[var(--header-h)] flex-1 w-full">
              {children}
            </main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
