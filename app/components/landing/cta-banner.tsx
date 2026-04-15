import Link from "next/link";

export function CtaBanner() {
  return (
    <div className="content-max pb-8">
      <div className="rounded-[var(--card-r)] border border-border bg-bg-alt p-8 text-center">
        <p className="mb-4 text-sm text-fg-2">
          Create a free account to access the full directory and research
          library.
        </p>

        <Link href="#" className="btn btn-primary mb-2">
          Create Free Account
        </Link>

        <div className="font-mono text-[10px] text-fg-2">
          No credit card required
        </div>
      </div>
    </div>
  );
}
