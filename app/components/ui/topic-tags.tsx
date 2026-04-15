"use client";

import { cn } from "@/app/lib/cn";

interface TopicTagsProps {
  tags: string[];
  onSelect?: (tag: string) => void;
  className?: string;
}

export function TopicTags({ tags, onSelect, className }: TopicTagsProps) {
  return (
    <div className={cn("flex items-center gap-1.5 flex-wrap", className)}>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect?.(tag)}
          className="badge bg-surface text-fg-2 hover:bg-surface-el hover:text-fg transition-colors cursor-pointer"
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
