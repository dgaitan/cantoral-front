import { cn } from "@/lib/utils/cn";

const LEADING_ARTICLE = /^(el|la|los|las|un|una)\s+/i;

const THEMES = [
  { bg: "bg-ink",       mark: "#dec42e" },
  { bg: "bg-ink-700",   mark: "#e37f3b" },
  { bg: "bg-[#0e2636]", mark: "#dec42e" },
] as const;

const SIZE_CLASSES = {
  sm: { wrap: "w-12 h-12 rounded-[10px]",   text: "text-[22px]" },
  md: { wrap: "w-[52px] h-[52px] rounded-[12px]", text: "text-[24px]" },
  lg: { wrap: "w-14 h-14 rounded-[14px]",   text: "text-[26px]" },
} as const;

type CoverSize = keyof typeof SIZE_CLASSES;

interface PlaylistCoverArtProps {
  name: string;
  uuid: string;
  size?: CoverSize;
  className?: string;
}

export function PlaylistCoverArt({
  name,
  uuid,
  size = "lg",
  className,
}: PlaylistCoverArtProps) {
  const seed = uuid.charCodeAt(0) + uuid.charCodeAt(uuid.length - 1);
  const theme = THEMES[seed % THEMES.length]!;
  const { wrap, text } = SIZE_CLASSES[size];
  const initial = name.replace(LEADING_ARTICLE, "").charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "relative overflow-hidden shrink-0 flex items-center justify-center",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]",
        theme.bg,
        wrap,
        className
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full opacity-50"
        aria-hidden="true"
      >
        <circle cx="50" cy="118" r="78" fill="none" stroke={theme.mark} strokeWidth="1" opacity="0.4" />
        <circle cx="50" cy="118" r="58" fill="none" stroke={theme.mark} strokeWidth="1" opacity="0.25" />
      </svg>
      <span
        className={cn(
          "font-serif font-semibold text-cream relative leading-none",
          text
        )}
        aria-hidden="true"
      >
        {initial}
      </span>
    </div>
  );
}
