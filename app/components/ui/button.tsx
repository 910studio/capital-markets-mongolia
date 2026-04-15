import { cn } from "@/app/lib/cn";

type ButtonVariant = "primary" | "secondary" | "signal" | "ghost";
type ButtonSize = "sm" | "default";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "default",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "btn",
        `btn-${variant}`,
        size === "sm" && "text-xs h-[28px] px-[10px]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
