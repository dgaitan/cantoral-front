import { cn } from "@/lib/utils/cn";
import type { HeadingProps } from "@/types/ui";

const SIZES: Record<NonNullable<HeadingProps["size"]>, string> = {
  sm: "text-[20px]",
  md: "text-[26px]",
  lg: "text-[30px] lg:text-[38px]",
  xl: "text-[32px] lg:text-[44px]",
};

const TONES: Record<NonNullable<HeadingProps["tone"]>, string> = {
  ink: "text-ink",
  cream: "text-cream",
};

export function Heading({
  children,
  as: Tag = "h1",
  size = "md",
  tone = "ink",
  eyebrow,
  id,
  className,
}: HeadingProps) {
  const heading = (
    <Tag
      id={id}
      className={cn(
        "font-serif font-semibold leading-tight tracking-[-0.01em]",
        SIZES[size],
        TONES[tone],
        className
      )}
    >
      {children}
    </Tag>
  );

  if (!eyebrow) return heading;

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-orange mb-1">
        {eyebrow}
      </p>
      {heading}
    </div>
  );
}
