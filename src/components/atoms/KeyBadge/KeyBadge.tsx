import { KeyRound } from "lucide-react";

interface KeyBadgeProps {
  tone: string;
}

export function KeyBadge({ tone }: KeyBadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontFamily: "var(--font-jetbrains)",
        fontSize: 11.5,
        fontWeight: 600,
        color: "var(--ink)",
        background: "var(--gold-soft)",
        padding: "4px 8px",
        borderRadius: 7,
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      <KeyRound size={12} aria-hidden="true" />
      {tone}
    </span>
  );
}
