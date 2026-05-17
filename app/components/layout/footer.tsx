"use client";

import Link from "next/link";
import { useState } from "react";
import { subscribeNewsletterAction } from "./subscribe-action";

const QUICK_LINKS = [
  { label: "About us", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Events", href: "/events" },
  { label: "Directory", href: "/directory" },
  { label: "Team", href: "/about#team" },
] as const;

const SERVICES_LINKS = [
  { label: "Advisory", href: "/about#consulting" },
  { label: "Research", href: "/insights" },
  { label: "Market Feed", href: "/feed" },
  { label: "Contact", href: "/about#contact" },
] as const;

const LEGAL_LINKS = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
] as const;

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/investmongolia",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "Facebook",
    href: "https://facebook.com/cmm.capitalmarketsmongolia",
    path: "M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.351C0 23.41.59 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.59 1.323-1.325V1.325C24 .59 23.41 0 22.675 0z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/capitalmarkets.mn",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@capitalmarketsmn",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
];

export function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{
        background: "var(--bg-alt)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="content-max px-6 py-14">
        {/* Top: 4 columns */}
        <div className="grid gap-10 max-md:grid-cols-1 max-lg:grid-cols-2" style={{ gridTemplateColumns: "1.4fr 1fr 1fr 1.5fr" }}>
          {/* Col 1 — brand */}
          <div>
            <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-fg no-underline">
              MarketIQ
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand ml-0.5 align-super" />
            </Link>
            <p className="mt-3 text-sm text-fg-2 leading-[1.6] max-w-[300px]">
              Mongolia&apos;s capital markets research, advisory, and intelligence.
            </p>
            <a
              href="mailto:info@capitalmarkets.mn"
              className="inline-block mt-4 text-sm font-display font-semibold text-brand hover:text-brand-h no-underline transition-colors"
            >
              info@capitalmarkets.mn
            </a>
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 inline-flex items-center justify-center rounded-[var(--btn-r)] text-fg-2 hover:text-brand hover:bg-surface transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h3 className="font-display font-extrabold text-[11px] tracking-[0.14em] uppercase text-fg-3 mb-4">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-fg-2 hover:text-brand no-underline transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div>
            <h3 className="font-display font-extrabold text-[11px] tracking-[0.14em] uppercase text-fg-3 mb-4">
              Services
            </h3>
            <ul className="flex flex-col gap-2.5">
              {SERVICES_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-fg-2 hover:text-brand no-underline transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <h3 className="font-display font-extrabold text-[11px] tracking-[0.14em] uppercase text-fg-3 mb-4">
              Subscribe
            </h3>
            <p className="text-sm text-fg-2 leading-[1.55] mb-3">
              MarketIQ Capital — Discovering Alpha in Mongolia. Get weekly briefs straight to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom: legal bar */}
        <div className="mt-12 pt-6 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: "1px solid var(--border-s)" }}>
          <p className="text-xs text-fg-3">
            &copy; {new Date().getFullYear()} Capital Markets Mongolia. All rights reserved.
          </p>
          <nav className="flex items-center gap-5">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-fg-3 hover:text-brand no-underline transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

/* ── Newsletter form ─────────────────────────────────────────── */

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    const res = await subscribeNewsletterAction({ email });
    if (res.ok) {
      setStatus("ok");
      setMessage(res.message);
      setEmail("");
    } else {
      setStatus("error");
      setMessage(res.message);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="email"
          required
          aria-label="Email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 min-w-0 h-[40px] px-3 text-sm font-display rounded-[var(--input-r,4px)] border border-border bg-[var(--bg)] text-fg outline-none focus:border-brand transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn btn-primary text-sm whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </div>
      {message && (
        <p
          className={`text-xs ${status === "ok" ? "text-pos" : "text-neg"}`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </form>
  );
}
