import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { FeedbackProvider } from "@910studio/feedback-widget";
import { Header } from "./components/layout/header";
import { Footer } from "./components/layout/footer";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
    <html
      lang="en"
      className={`${plusJakarta.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen">
        <FeedbackProvider config={{ projectId: "cmm-fe", accentColor: "#7B4FD6" }}>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="pt-[var(--header-h)] flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </FeedbackProvider>
      </body>
    </html>
  );
}
