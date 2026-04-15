import Link from "next/link";

export function CtaBanner() {
  return (
    <div className="content-max pb-8">
      <div className="rounded-[var(--card-r)] border border-brand/20 p-10 text-center" style={{ background: "var(--grad-surface)" }}>
        <h2 className="font-display font-extrabold text-xl tracking-tight mb-2">
          Mongolia&apos;s capital markets, decoded.
        </h2>
        <p className="mb-6 text-sm text-fg-2 max-w-[400px] mx-auto">
          Create a free account to access the full directory, research library, and market feed.
        </p>

        <Link href="/sign-in" className="btn btn-primary no-underline font-bold px-8 py-2.5">
          Create Free Account
        </Link>

        <div className="font-mono text-[10px] text-fg-3 mt-3">
          No credit card required
        </div>
      </div>
    </div>
  );
}
