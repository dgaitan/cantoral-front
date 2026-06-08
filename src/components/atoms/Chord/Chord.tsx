import { cn } from "@/lib/utils/cn";

interface ChordProps {
  name: string;
  className?: string;
}

export function Chord({ name, className }: ChordProps) {
  return (
    <span
      className={cn(
        "inline-block text-primary font-bold text-xs leading-none mr-0.5",
        className
      )}
      aria-label={`acorde ${name}`}
    >
      {name}
    </span>
  );
}
