import Link from "next/link";

interface RegistrationCtaWidgetProps {
  entityName: string;
  className?: string;
}

export function RegistrationCtaWidget({ entityName, className }: RegistrationCtaWidgetProps) {
  return (
    <div
      className={`p-4 rounded-[var(--card-r)] border border-border bg-surface-down flex flex-col gap-2 ${className ?? ""}`}
    >
      <div className="font-mono text-[10px] uppercase tracking-badge text-fg-3">
        Free Account
      </div>
      <p className="font-display font-bold text-sm leading-[1.35]">
        Track {entityName}.
      </p>
      <p className="text-xs text-fg-2 leading-[1.5]">
        Save the profile, get earnings alerts, and download CMM-verified reports.
      </p>
      <Link href="/sign-in" className="btn btn-secondary text-sm w-full justify-center mt-1">
        Create free account
      </Link>
    </div>
  );
}
