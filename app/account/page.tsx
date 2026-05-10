import type { Metadata } from "next";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { apiGet } from "@/app/lib/api";
import { getBffToken } from "@/app/lib/auth";
import { AccountPortal } from "./account-portal";

export const metadata: Metadata = {
  title: "My Account — MarketIQ",
  description: "Saved insights, registered events, concierge requests, and profile.",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return (
      <div className="content-max px-6 py-20">
        <p className="font-display font-bold text-[10px] tracking-[0.18em] uppercase text-fg-3 mb-2">My Account</p>
        <h1 className="font-display font-extrabold text-2xl mb-4">Sign in required</h1>
        <Link href="/sign-in" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  // Try to pull the synced profile from BFF; soft-fail if webhook hasn't fired yet.
  const token = await getBffToken();
  let bffSyncIssue: string | null = null;
  if (token) {
    try {
      await apiGet("/api/users/me", { token });
    } catch (err) {
      bffSyncIssue = err instanceof Error ? err.message : String(err);
    }
  }

  const email = clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? "";

  return (
    <div className="content-max px-6 pb-16">
      <div className="pt-8 pb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-badge text-brand mb-2">
            My Account
          </div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight leading-heading">
            {email}
          </h1>
        </div>
        <SignOutButton>
          <button className="text-sm text-fg-3 font-medium hover:text-brand cursor-pointer bg-transparent border-none">
            Sign Out
          </button>
        </SignOutButton>
      </div>

      {bffSyncIssue && (
        <div className="mb-6 border border-border-s rounded-[var(--card-r)] p-4 bg-surface text-sm">
          <p className="font-display font-semibold mb-1">Profile not synced yet</p>
          <p className="text-fg-2">
            BFF said: <code className="font-mono text-xs">{bffSyncIssue}</code>
          </p>
          <p className="text-xs text-fg-3 mt-2">
            Configure the Clerk webhook (Dashboard → Webhooks) to POST <code className="font-mono">/api/users/sync</code> on user.* events.
          </p>
        </div>
      )}

      <AccountPortal />
    </div>
  );
}
