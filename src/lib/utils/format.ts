/**
 * Formats a count for compact display: sub-1000 stays as a localized
 * integer, 1,000+ collapses to one decimal with a k/M/B suffix
 * (dropping the decimal when it rounds to a whole number).
 * 999 → "999", 1000 → "1k", 1100 → "1.1k", 1500000 → "1.5M".
 */
export function formatCompactNumber(value: number): string {
  if (value < 1000) return value.toLocaleString("es");

  const tiers = [
    { threshold: 1_000_000_000, suffix: "B" },
    { threshold: 1_000_000, suffix: "M" },
    { threshold: 1_000, suffix: "k" },
  ];
  const tier = tiers.find((t) => value >= t.threshold)!;

  const scaled = value / tier.threshold;
  const rounded = Math.round(scaled * 10) / 10;

  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}${tier.suffix}`;
}
