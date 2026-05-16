"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
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
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Transparent + white-on-dark variant for routes that own the top of the
  // viewport (e.g. /events with its full-bleed brutalist hero).
  const transparent = pathname === "/events";

  return (
    <header
      data-transparent={transparent || undefined}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[var(--header-h)]",
        transparent ? "border-b-0" : "border-b border-border",
      )}
      style={{ background: transparent ? "transparent" : "var(--bg)" }}
    >
      <div className="content-max h-full flex items-center justify-between">
        {/* Left: logo + nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className={cn(
              "font-display text-lg font-[800] tracking-tight no-underline",
              transparent ? "text-white" : "text-fg",
            )}
          >
            MarketIQ
            <span
              className={cn(
                "inline-block w-1.5 h-1.5 rounded-full ml-0.5 align-super",
                transparent ? "bg-white" : "bg-brand",
              )}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              if (transparent) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "inline-flex items-center px-3 h-[34px] rounded-[var(--tab-r)] no-underline font-display text-sm transition-colors",
                      active
                        ? "text-white font-semibold bg-white/10"
                        : "text-white/70 font-medium hover:text-white hover:bg-white/10",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn("tab", active && "tab-active")}
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
            className={cn(
              "w-[44px] h-[44px] p-0 inline-flex items-center justify-center transition-colors",
              transparent
                ? "text-white hover:bg-white/10 rounded-[var(--btn-r)]"
                : "btn btn-ghost",
            )}
            aria-label="Search"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          {/* Mobile hamburger */}
          <button
            className={cn(
              "w-[44px] h-[44px] p-0 !hidden max-[440px]:!inline-flex items-center justify-center transition-colors",
              transparent
                ? "text-white hover:bg-white/10 rounded-[var(--btn-r)]"
                : "btn btn-ghost",
            )}
            aria-label="Menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              {mobileOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {isLoaded && !isSignedIn && (
            <div className="hidden sm:flex items-center gap-1">
              <Link
                href="/sign-in"
                className={cn(
                  "px-3 h-[34px] inline-flex items-center font-display font-semibold text-sm transition-colors no-underline",
                  transparent
                    ? "text-white/80 hover:text-white"
                    : "text-fg hover:text-brand",
                )}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={cn(
                  transparent
                    ? "inline-flex items-center px-4 h-[34px] font-display font-bold text-sm no-underline transition-colors"
                    : "btn btn-primary",
                )}
                style={
                  transparent
                    ? {
                        background: "var(--signal)",
                        color: "var(--fg)",
                        borderRadius: 2,
                        letterSpacing: "0.04em",
                      }
                    : undefined
                }
              >
                Get started
              </Link>
            </div>
          )}
          {isLoaded && isSignedIn && (
            <div className="hidden sm:flex items-center">
              <UserButton />
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <nav
          className="hidden max-[440px]:block border-t border-border"
          style={{ background: "var(--bg)" }}
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
            {isLoaded && !isSignedIn && (
              <div className="mt-2 sm:hidden flex flex-col gap-2">
                <Link href="/sign-in" className="btn btn-secondary text-center">
                  Sign In
                </Link>
                <Link href="/sign-up" className="btn btn-primary text-center">
                  Get started
                </Link>
              </div>
            )}
            {isLoaded && isSignedIn && (
              <div className="mt-3 sm:hidden flex justify-center">
                <UserButton />
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
