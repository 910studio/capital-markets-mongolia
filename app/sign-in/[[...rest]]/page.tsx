import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign In — MarketIQ",
  description: "Sign in to your MarketIQ account.",
};

export default function SignInPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-20">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none border border-border-s rounded-[var(--card-r)]",
          },
        }}
      />
    </div>
  );
}
