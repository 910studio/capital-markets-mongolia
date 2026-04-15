"use client";

import { useState } from "react";
import { cn } from "@/app/lib/cn";

type Phase = "input" | "sending" | "sent";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<Phase>("input");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setPhase("sending");
    // Simulate magic link send
    setTimeout(() => setPhase("sent"), 1200);
  };

  if (phase === "sent") {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-[var(--card-r)] bg-pos-m grid place-items-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--pos)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          </svg>
        </div>
        <h2 className="font-display font-bold text-xl tracking-tight mb-2">
          Check your email
        </h2>
        <p className="text-sm text-fg-2 mb-1">
          We sent a sign-in link to
        </p>
        <p className="font-mono text-sm font-semibold text-fg mb-6">
          {email}
        </p>
        <p className="text-xs text-fg-3">
          The link expires in 24 hours. If you don&apos;t see it, check your spam folder.
        </p>
        <button
          onClick={() => { setPhase("input"); setEmail(""); }}
          className="mt-6 text-sm text-brand-l font-medium hover:text-brand cursor-pointer bg-transparent border-none"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-0 border-2 border-border rounded-[var(--btn-r)] overflow-hidden transition-colors focus-within:border-brand">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          disabled={phase === "sending"}
          className={cn(
            "flex-1 px-4 h-[44px] bg-[var(--white)] text-fg text-sm font-body",
            "border-none outline-none placeholder:text-fg-3",
            phase === "sending" && "opacity-50"
          )}
        />
        <button
          type="submit"
          disabled={phase === "sending" || !email.trim()}
          className={cn(
            "btn btn-primary h-[44px] px-5 rounded-none border-none shrink-0",
            "font-display font-bold text-sm",
            phase === "sending" && "opacity-70 cursor-wait"
          )}
        >
          {phase === "sending" ? "Sending..." : "Get link"}
        </button>
      </div>
    </form>
  );
}
