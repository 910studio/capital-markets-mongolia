"use client";

import { cn } from "@/app/lib/cn";

interface FilterItem {
  label: string;
  value: string;
}

interface FilterBarProps {
  items: FilterItem[];
  active: string;
  onFilter: (value: string) => void;
  className?: string;
}

export function FilterBar({ items, active, onFilter, className }: FilterBarProps) {
  return (
    <div className={cn("flex items-center gap-1 flex-wrap", className)}>
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onFilter(item.value)}
          className={cn(
            "tab",
            item.value === active && "tab-active"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
