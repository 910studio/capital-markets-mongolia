import type { Metadata } from "next";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "My Account — MarketIQ",
  description: "Manage your MarketIQ profile and preferences.",
};

export default function AccountPage() {
  return (
    <div className="content-max py-10">
      {/* Email bar */}
      <div className="text-center py-3 px-4 bg-surface rounded-[var(--card-r)] border border-border-s mb-8">
        <span className="font-mono text-xs text-fg-2 tracking-wide uppercase">
          ganerdene.dev@gmail.com
        </span>
      </div>

      <div className="max-w-[520px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-extrabold text-xl tracking-tight">
            My Profile
          </h1>
          <button className="text-sm text-brand-l font-medium hover:text-brand cursor-pointer bg-transparent border-none">
            Sign Out
          </button>
        </div>

        <ProfileForm />
      </div>
    </div>
  );
}
