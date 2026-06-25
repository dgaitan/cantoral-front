import type { ReactNode } from "react";

export interface HeadingProps {
  children: ReactNode;
  /** Rendered element. Defaults to "h1". */
  as?: "h1" | "h2" | "h3" | "p";
  /** Typographic scale. Defaults to "md" (page titles). */
  size?: "sm" | "md" | "lg" | "xl";
  /** Color on light ("ink") or dark ("cream") backgrounds. Defaults to "ink". */
  tone?: "ink" | "cream";
  /** Optional orange uppercase kicker rendered above the heading. */
  eyebrow?: string;
  /** Layout-only overrides (margins, alignment) applied at the call site. */
  className?: string;
}
