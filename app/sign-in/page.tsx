import type { Metadata } from "next";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign In — MarketIQ",
  description: "Sign in or create an account with your email address.",
};

export default function SignInPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-[440px] text-center">
        <h1 className="font-display font-extrabold text-3xl tracking-tight mb-3">
          Sign in or create an account with your email address.
        </h1>
        <p className="text-base text-fg-2 mb-10">
          We&apos;ll send you a sign-in link.
        </p>

        <SignInForm />

        <p className="text-xs text-fg-3 mt-8 leading-relaxed max-w-[340px] mx-auto">
          By continuing, you agree to MarketIQ&apos;s{" "}
          <a href="#" className="text-brand-l hover:text-brand no-underline">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-brand-l hover:text-brand no-underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
