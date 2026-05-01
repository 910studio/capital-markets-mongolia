import Link from "next/link";
import Image from "next/image";
import type { MockSpeaker } from "@/app/lib/mock-data";

interface SpeakerCardProps {
  speaker: MockSpeaker;
  size?: "sm" | "md";
}

export function SpeakerCard({ speaker, size = "md" }: SpeakerCardProps) {
  const isSm = size === "sm";
  return (
    <Link
      href={`/events/speakers/${speaker.slug}`}
      className="card flex items-start gap-3 no-underline group"
    >
      <Avatar speaker={speaker} size={isSm ? "sm" : "md"} />
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-sm leading-[1.25] group-hover:text-brand transition-colors">
          {speaker.name}
        </div>
        <div className="text-[11px] text-fg-2 mt-0.5 leading-[1.4]">
          {speaker.title}
        </div>
        <div className="text-[11px] text-fg-3 mt-0.5">
          {speaker.org}
        </div>
      </div>
    </Link>
  );
}

export function Avatar({
  speaker,
  size = "md",
}: {
  speaker: Pick<MockSpeaker, "initials" | "name" | "photo">;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? "w-9 h-9 text-[11px]" : size === "lg" ? "w-16 h-16 text-base" : "w-11 h-11 text-xs";
  const px = size === "sm" ? 36 : size === "lg" ? 64 : 44;

  if (speaker.photo) {
    return (
      <div
        className={`shrink-0 ${dim} rounded-full overflow-hidden relative bg-brand-m`}
        aria-label={speaker.name}
      >
        <Image
          src={speaker.photo}
          alt={speaker.name}
          width={px}
          height={px}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`shrink-0 ${dim} rounded-full bg-brand-m text-brand font-display font-bold grid place-items-center`}
      aria-label={speaker.name}
    >
      {speaker.initials}
    </div>
  );
}
