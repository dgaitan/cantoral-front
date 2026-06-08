import { ChevronRight } from "lucide-react";

interface SectionHeadProps {
  title: string;
  kicker?: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHead({
  title,
  kicker,
  action,
  onAction,
}: SectionHeadProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: 14,
      }}
    >
      <div>
        {kicker && (
          <div
            style={{
              fontFamily: "var(--font-hanken)",
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--orange)",
              marginBottom: 5,
              whiteSpace: "nowrap",
            }}
          >
            {kicker}
          </div>
        )}
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: 22,
            fontWeight: 600,
            color: "var(--ink)",
            margin: 0,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </h2>
      </div>
      {action && (
        <button
          onClick={onAction}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-hanken)",
            fontSize: 13.5,
            fontWeight: 600,
            color: "var(--muted)",
            padding: 0,
          }}
        >
          {action}
          <ChevronRight size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
