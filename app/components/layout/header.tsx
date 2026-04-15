"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/app/lib/cn";

const NAV_LINKS = [
  { label: "Directory", href: "/directory" },
  { label: "Insights", href: "/insights" },
  { label: "Market Feed", href: "/feed" },
  { label: "Events", href: "/events" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[var(--header-h)] border-b border-border"
      style={{ background: "var(--header-blur)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
    >
      <div className="content-max h-full flex items-center justify-between">
        {/* Left: logo + nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-lg font-[800] tracking-tight text-fg no-underline">
            MarketIQ
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand ml-0.5 align-super" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "tab",
                    active && "tab-active"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: search + hamburger (mobile) + sign in */}
        <div className="flex items-center gap-2">
          <button
            className="btn btn-ghost w-[34px] h-[34px] p-0"
            aria-label="Search"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden btn btn-ghost w-[34px] h-[34px] p-0"
            aria-label="Menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              {mobileOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link href="/sign-in" className="btn btn-primary hidden sm:inline-flex">
            Sign In
          </Link>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <nav
          className="md:hidden border-t border-border"
          style={{ background: "var(--header-blur)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div className="content-max flex flex-col py-2">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "py-2.5 px-3 rounded-[var(--btn-r)] text-sm font-medium no-underline transition-colors",
                    active
                      ? "text-brand bg-brand-m"
                      : "text-fg-2 hover:text-fg hover:bg-surface"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/sign-in"
              className="btn btn-primary mt-2 sm:hidden text-center"
            >
              Sign In
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
