import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Create account — MarketIQ",
  description: "Create your MarketIQ account.",
};

export default function SignUpPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-20">
      <SignUp
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
