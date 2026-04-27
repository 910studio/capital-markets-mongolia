import type { Metadata } from "next";
import { AccountPortal } from "./account-portal";

export const metadata: Metadata = {
  title: "My Account — MarketIQ",
  description: "Saved insights, registered events, concierge requests, and profile.",
};

export default function AccountPage() {
  return (
    <div className="content-max px-6 pb-16">
      <div className="pt-8 pb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-badge text-brand mb-2">
            My Account
          </div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight leading-heading">
            ganerdene.dev@gmail.com
          </h1>
        </div>
        <button className="text-sm text-fg-3 font-medium hover:text-brand cursor-pointer bg-transparent border-none">
          Sign Out
        </button>
      </div>

      <AccountPortal />
    </div>
  );
}
