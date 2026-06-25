import { KeyRound } from "lucide-react";

interface KeyBadgeProps {
  tone: string;
}

export function KeyBadge({ tone }: KeyBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[11.5px] font-semibold text-ink bg-gold-soft px-2 py-1 rounded-[7px] shrink-0 whitespace-nowrap">
      <KeyRound size={12} aria-hidden="true" />
      {tone}
    </span>
  );
}
