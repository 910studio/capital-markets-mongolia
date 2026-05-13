import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/app/lib/clerk-appearance";

export const metadata: Metadata = {
  title: "Create account — MarketIQ",
  description: "Create your MarketIQ account.",
};

export default function SignUpPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-20">
      <SignUp appearance={clerkAppearance} />
    </div>
  );
}
