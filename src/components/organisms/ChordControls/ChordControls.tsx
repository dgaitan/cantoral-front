"use client";

import { Minus, Plus, Music } from "lucide-react";
import { transposeChord } from "@/lib/lyrics/transpose";

interface ChordControlsProps {
  steps: number;
  onStepsChange: (steps: number) => void;
  showChords: boolean;
  onShowChordsChange: (show: boolean) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  baseKey: string;
}

const ctrlBtn: React.CSSProperties = {
  width: 40,
  height: 34,
  borderRadius: 9,
  border: "none",
  background: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--ink)",
  boxShadow: "0 1px 2px rgba(10,29,43,0.08)",
  flexShrink: 0,
};

export function ChordControls({
  steps,
  onStepsChange,
  showChords,
  onShowChordsChange,
  fontSize,
  onFontSizeChange,
  baseKey,
}: ChordControlsProps) {
  const currentKey = transposeChord(baseKey, steps);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Tono row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontFamily: "var(--font-hanken)",
            fontSize: 12.5,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted)",
            width: 56,
            flexShrink: 0,
          }}
        >
          Tono
        </span>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--paper-2)",
            borderRadius: 12,
            padding: 5,
          }}
        >
          <button
            onClick={() => onStepsChange(steps - 1)}
            style={ctrlBtn}
            aria-label="Bajar tono"
          >
            <Minus size={18} />
          </button>
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--ink)",
              }}
            >
              {currentKey}
            </span>
            {steps !== 0 && (
              <span
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: 12,
                  color: "var(--orange)",
                  marginLeft: 5,
                }}
              >
                {steps > 0 ? "+" : ""}
                {steps}
              </span>
            )}
          </div>
          <button
            onClick={() => onStepsChange(steps + 1)}
            style={ctrlBtn}
            aria-label="Subir tono"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Texto + Acordes row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontFamily: "var(--font-hanken)",
            fontSize: 12.5,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted)",
            width: 56,
            flexShrink: 0,
          }}
        >
          Texto
        </span>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--paper-2)",
            borderRadius: 12,
            padding: 5,
          }}
        >
          <button
            onClick={() => onFontSizeChange(Math.max(15, fontSize - 1))}
            style={ctrlBtn}
            aria-label="Reducir texto"
          >
            <span
              style={{
                fontFamily: "var(--font-newsreader)",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              A
            </span>
          </button>
          <span
            style={{
              fontFamily: "var(--font-hanken)",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--muted)",
            }}
          >
            {fontSize}px
          </span>
          <button
            onClick={() => onFontSizeChange(Math.min(28, fontSize + 1))}
            style={ctrlBtn}
            aria-label="Aumentar texto"
          >
            <span
              style={{
                fontFamily: "var(--font-newsreader)",
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              A
            </span>
          </button>
        </div>
        <button
          onClick={() => onShowChordsChange(!showChords)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 13px",
            borderRadius: 12,
            cursor: "pointer",
            border: `1px solid ${showChords ? "transparent" : "var(--line)"}`,
            background: showChords ? "var(--ink)" : "#fff",
            color: showChords ? "#fff" : "var(--muted)",
            fontFamily: "var(--font-hanken)",
            fontSize: 13,
            fontWeight: 600,
            flexShrink: 0,
          }}
          aria-pressed={showChords}
        >
          <Music size={16} aria-hidden="true" /> Acordes
        </button>
      </div>
    </div>
  );
}
