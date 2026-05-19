import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkAppearance } from "./lib/clerk-appearance";
import "./globals.css";
import { Header } from "./components/layout/header";
import { Footer } from "./components/layout/footer";
import { OfflineScreen } from "./components/layout/offline-screen";

// Single font: Inter — the open Helvetica clone. Used everywhere:
// display, body, serif slot (no more Newsreader), mono slot (no more
// JetBrains Mono). One typeface, all surfaces.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
        className={`${inter.variable} h-full antialiased`}
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
