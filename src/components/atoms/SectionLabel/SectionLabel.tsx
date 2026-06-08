import { cn } from "@/lib/utils/cn";

interface SectionLabelProps {
  type: string;
  className?: string;
}

const LABEL_MAP: Record<string, string> = {
  verse: "Verso",
  chorus: "Coro",
  bridge: "Puente",
  intro: "Intro",
  outro: "Outro",
};

export function SectionLabel({ type, className }: SectionLabelProps) {
  const label = LABEL_MAP[type] ?? type;
  return (
    <span
      className={cn(
        "inline-block text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-1",
        className
      )}
    >
      {label}
    </span>
  );
}
