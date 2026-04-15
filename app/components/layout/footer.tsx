import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Directory", href: "/directory" },
  { label: "Insights", href: "/insights" },
  { label: "Market Feed", href: "/feed" },
  { label: "Events", href: "/events" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="content-max py-6 flex items-center justify-between text-xs text-fg-3">
        <span>&copy; {new Date().getFullYear()} Capital Markets Mongolia. All rights reserved.</span>
        <nav className="hidden sm:flex items-center gap-4">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-fg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
