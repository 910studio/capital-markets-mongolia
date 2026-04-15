import Link from "next/link";

export function PaywallDemo() {
  return (
    <div className="content-max pb-8">
      <div className="card overflow-hidden !p-0">
        {/* Header */}
        <div
          className="flex items-start justify-between gap-4 px-6 py-5"
          style={{ borderBottom: "1px solid var(--border-s)" }}
        >
          <div>
            {/* Badges */}
            <div className="mb-1.5 flex gap-1.5">
              <span className="rounded-xs bg-brand-m px-2 py-0.5 font-display text-[10px] font-semibold text-brand">
                Comprehensive Guide
              </span>
              <span
                className="rounded-xs px-2 py-0.5 font-display text-[10px] font-semibold text-white"
                style={{ background: "var(--grad-brand)" }}
              >
                Premium
              </span>
            </div>

            {/* Title */}
            <div className="font-display text-[17px] font-bold leading-[1.3]">
              Mongolia&apos;s Mining Sector: Q1 2026 Performance Review &amp;
              Institutional Outlook
            </div>

            {/* Meta */}
            <div className="mt-1 text-[11px] text-fg-2">
              By CMM Research Team &middot; April 1, 2026 &middot; 14 min read
            </div>
          </div>

          {/* Counter */}
          <div className="flex shrink-0 items-center gap-[5px] rounded-full bg-signal-m px-3 py-[5px] font-mono text-[10px] font-medium text-signal">
            <span className="h-[5px] w-[5px] rounded-full bg-signal" />
            0 of 3 free reads
          </div>
        </div>

        {/* Body - article text with gradient fade */}
        <div className="relative px-6 py-6">
          <p className="mb-3.5 text-sm leading-[1.75]">
            Mongolia&apos;s mining sector delivered record performance in Q1
            2026, with the MSE Mining Index surging 18.4% &mdash; outpacing the
            broader MSE Top 20 by a factor of three. The rally was driven by
            copper prices hitting $11,200/t on LME, gold sustaining above
            $2,800/oz, and the tugrik stabilizing against the USD.
          </p>
          <p className="mb-3.5 text-sm leading-[1.75] text-fg-2">
            Foreign portfolio inflows into MSE-listed mining stocks reached{" "}
            {"\u20AE"}1.8 trillion &mdash; up 42% from Q4 2025. Three Hong
            Kong-based asset managers initiated new positions in Tavan Tolgoi
            (TTL) and Mongolian Mining Corporation (MMC), signaling growing
            confidence in Mongolia&apos;s coal-to-copper transition thesis.
          </p>
          <p className="mb-3.5 text-sm leading-[1.75] text-fg-2">
            Erdene Resource Development (ERD) emerged as the quarter&apos;s
            standout performer, gaining 34% on updated resource estimates at
            Bayan Khundii. The measured and indicated resource now stands at 2.4
            million ounces at 1.8 g/t &mdash; a 28% increase. However, the
            rally masks significant dispersion across...
          </p>

          {/* Gradient fade */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[180px]"
            style={{
              background:
                "linear-gradient(transparent, var(--white))",
            }}
          />
        </div>

        {/* Paywall wall */}
        <div className="relative z-[1] -mt-8 px-6 pb-8 pt-10 text-center">
          {/* Lock icon */}
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-m">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="h-[18px] w-[18px] text-brand"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>

          <h3 className="mb-1.5 font-display text-[15px] font-bold">
            Continue reading with a free account
          </h3>
          <p className="mx-auto mb-4 max-w-[320px] text-xs text-fg-2">
            Access unlimited research and intelligence on Mongolia&apos;s
            capital markets.
          </p>

          <Link href="#" className="btn btn-primary mb-2.5 text-xs">
            Create Free Account
          </Link>

          <div className="text-[11px] text-fg-2">
            Already have an account?{" "}
            <Link href="#" className="font-semibold text-brand">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
