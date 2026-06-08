interface LogoProps {
  size?: number;
  mono?: boolean;
}

export function Logo({ size = 26, mono = false }: LogoProps) {
  const gold = mono ? "currentColor" : "var(--gold)";
  const orange = mono ? "currentColor" : "var(--orange)";
  const textColor = mono ? "currentColor" : "var(--ink)";
  const kickerColor = mono ? "currentColor" : "var(--orange)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        <circle
          cx="20"
          cy="20"
          r="18.5"
          stroke={gold}
          strokeWidth="1.6"
          opacity={mono ? 0.5 : 0.9}
        />
        <path
          d="M20 9v22M14 14h12"
          stroke={orange}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="20" cy="25.5" r="2.4" fill={gold} />
      </svg>
      <div style={{ lineHeight: 1 }}>
        <div
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: size * 0.62,
            fontWeight: 600,
            color: textColor,
            letterSpacing: "-0.01em",
          }}
        >
          Cancionero
        </div>
        <div
          style={{
            fontFamily: "var(--font-hanken)",
            fontSize: size * 0.34,
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: kickerColor,
            marginTop: 2,
          }}
        >
          Católico
        </div>
      </div>
    </div>
  );
}
