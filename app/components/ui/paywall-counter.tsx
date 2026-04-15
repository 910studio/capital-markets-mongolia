import { cn } from "@/app/lib/cn";

interface PaywallCounterProps {
  used: number;
  total: number;
  className?: string;
}

export function PaywallCounter({ used, total, className }: PaywallCounterProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs text-fg-2 font-mono",
        className
      )}
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "block w-1.5 h-1.5 rounded-full",
              i < used ? "bg-brand" : "bg-border"
            )}
          />
        ))}
      </div>
      <span>
        {used} of {total} free articles read
      </span>
    </div>
  );
}
