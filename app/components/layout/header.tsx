"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/app/lib/cn";

type NavChild = { label: string; href: string; description?: string };
type NavItem =
  | { label: string; href: string }
  | { label: string; children: readonly NavChild[]; rootHref?: string };

const NAV_LINKS: readonly NavItem[] = [
  {
    label: "Directory",
    rootHref: "/directory",
    children: [
      { label: "Public Companies", href: "/directory?type=public_company" },
      { label: "Private Companies", href: "/directory?type=private_company" },
      { label: "Projects", href: "/directory?type=project" },
      { label: "Service Providers", href: "/directory?type=service_provider" },
    ],
  },
  { label: "Insights", href: "/insights" },
  { label: "Market Feed", href: "/feed" },
  { label: "Events", href: "/events" },
  {
    label: "About",
    rootHref: "/about",
    children: [
      { label: "About", href: "/about" },
      { label: "Consulting", href: "/about#consulting" },
      { label: "Contact", href: "/about#contact" },
    ],
  },
] as const;

function isDropdown(
  item: NavItem,
): item is { label: string; children: readonly NavChild[]; rootHref?: string } {
  return "children" in item;
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Transparent + white-on-dark variant for routes that own the top of the
  // viewport (e.g. /events index AND /events/[slug] detail — themed event
  // pages run an iframe right under the navbar and the cover-image hero on
  // standard events also needs the dark-bg treatment).
  const transparent = pathname === "/events" || pathname.startsWith("/events/");

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
            {NAV_LINKS.map((item) => {
              if (isDropdown(item)) {
                const targetHref = item.rootHref ?? item.children[0].href;
                const active = pathname.startsWith(targetHref.split("?")[0]);
                return (
                  <NavDropdown
                    key={item.label}
                    item={item}
                    transparent={transparent}
                    active={active}
                  />
                );
              }
              const active = pathname.startsWith(item.href);
              if (transparent) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-3 h-[34px] rounded-[var(--tab-r)] no-underline font-display text-sm transition-colors",
                      active
                        ? "text-white font-semibold bg-white/10"
                        : "text-white/70 font-medium hover:text-white hover:bg-white/10",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("tab", active && "tab-active")}
                >
                  {item.label}
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
            {NAV_LINKS.flatMap((item): React.ReactNode[] => {
              if (isDropdown(item)) {
                // Flatten dropdown into individual links + a small group label
                return [
                  <div
                    key={`${item.label}-label`}
                    className="text-[10px] font-display font-bold uppercase tracking-[0.1em] text-fg-3 px-3 pt-3 pb-1"
                  >
                    {item.label}
                  </div>,
                  ...item.children.map((child) => {
                    const active = pathname.startsWith(child.href.split("?")[0]);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "py-2.5 px-3 rounded-[var(--btn-r)] text-sm font-medium no-underline transition-colors",
                          active
                            ? "text-brand bg-brand-m"
                            : "text-fg-2 hover:text-fg hover:bg-surface",
                        )}
                      >
                        {child.label}
                      </Link>
                    );
                  }),
                ];
              }
              const active = pathname.startsWith(item.href);
              return [
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "py-2.5 px-3 rounded-[var(--btn-r)] text-sm font-medium no-underline transition-colors",
                    active
                      ? "text-brand bg-brand-m"
                      : "text-fg-2 hover:text-fg hover:bg-surface",
                  )}
                >
                  {item.label}
                </Link>,
              ];
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

/* ── NavDropdown — hover/focus-open menu with grace-period close ─── */

function NavDropdown({
  item,
  transparent,
  active,
}: {
  item: { label: string; children: readonly NavChild[]; rootHref?: string };
  transparent: boolean;
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function scheduleHide() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  // Trigger looks identical to a regular nav link in either variant.
  const triggerClass = transparent
    ? cn(
        "inline-flex items-center gap-1.5 px-3 h-[34px] rounded-[var(--tab-r)] no-underline font-display text-sm transition-colors cursor-pointer bg-transparent border-0",
        active
          ? "text-white font-semibold bg-white/10"
          : "text-white/70 font-medium hover:text-white hover:bg-white/10",
      )
    : cn("tab inline-flex items-center gap-1.5 bg-transparent border-0 cursor-pointer", active && "tab-active");

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={scheduleHide}
      onFocus={show}
      onBlur={scheduleHide}
    >
      <button
        type="button"
        className={triggerClass}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {item.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .15s" }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full pt-2 min-w-[220px] z-50"
          // pt-2 gives a non-clickable gap visually but the wrapper still
          // catches mouseenter so the menu stays open across the trigger→menu jump.
        >
          <div
            className="rounded-[var(--card-r,8px)] border border-border-s shadow-lg overflow-hidden py-1"
            style={{ background: "var(--bg)" }}
          >
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                role="menuitem"
                className="block px-4 py-2.5 text-sm font-display font-medium text-fg-2 hover:text-brand hover:bg-surface no-underline transition-colors"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
