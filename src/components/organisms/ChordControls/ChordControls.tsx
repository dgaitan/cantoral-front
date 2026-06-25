"use client";

import { Minus, Plus, Music } from "lucide-react";
import { Button } from "@heroui/react";
import { transposeKey } from "@/lib/lyrics/transpose-spanish";

interface ChordControlsProps {
  steps: number;
  onStepsChange: (steps: number) => void;
  showChords: boolean;
  onShowChordsChange: (show: boolean) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  baseKey: string;
}

export function ChordControls({
  steps,
  onStepsChange,
  showChords,
  onShowChordsChange,
  fontSize,
  onFontSizeChange,
  baseKey,
}: ChordControlsProps) {
  const currentKey = transposeKey(baseKey, steps);

  return (
    <div className="flex flex-col gap-[10px] lg:gap-6">
      {/* Tono row */}
      <div className="flex flex-row lg:flex-col items-center lg:items-start gap-[10px]">
        <span className="font-sans text-[12.5px] font-bold tracking-[0.12em] uppercase text-muted w-14 shrink-0">
          Tono
        </span>
        <div className="flex-1 lg:w-full flex items-center justify-between bg-paper-2 rounded-[50px] p-[5px]">
          <Button
            isIconOnly
            variant="outline"
            onPress={() => onStepsChange(steps - 1)}
            className="w-10 h-[34px] min-w-0 shadow-[0_1px_2px_rgba(10,29,43,0.08)]"
            aria-label="Bajar tono"
          >
            <Minus size={18} />
          </Button>
          <div className="text-center">
            <span data-testid="current-key" className="font-mono text-[18px] font-bold text-ink">
              {currentKey}
            </span>
            {steps !== 0 && (
              <span className="font-mono text-xs text-orange ml-[5px]">
                {steps > 0 ? "+" : ""}
                {steps}
              </span>
            )}
          </div>
          <Button
            isIconOnly
            variant="outline"
            onPress={() => onStepsChange(steps + 1)}
            className="w-10 h-[34px] min-w-0 shadow-[0_1px_2px_rgba(10,29,43,0.08)]"
            aria-label="Subir tono"
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>

      {/* Texto + Acordes row */}
      <div className="flex flex-row lg:flex-col items-center lg:items-start gap-[10px]">
        <span className="font-sans text-[12.5px] font-bold tracking-[0.12em] uppercase text-muted w-14 shrink-0">
          Texto
        </span>
        <div className="flex-1 lg:w-full flex items-center justify-between bg-paper-2 rounded-[50px] p-[5px]">
          <Button
            isIconOnly
            variant="outline"
            onPress={() => onFontSizeChange(Math.max(15, fontSize - 1))}
            className="w-10 h-[34px] min-w-0 shadow-[0_1px_2px_rgba(10,29,43,0.08)]"
            aria-label="Reducir texto"
          >
            <span className="font-serif text-sm font-semibold">A</span>
          </Button>
          <span className="font-sans text-[13px] font-semibold text-muted">
            {fontSize}px
          </span>
          <Button
            isIconOnly
            variant="outline"
            onPress={() => onFontSizeChange(Math.min(28, fontSize + 1))}
            className="w-10 h-[34px] min-w-0 shadow-[0_1px_2px_rgba(10,29,43,0.08)]"
            aria-label="Aumentar texto"
          >
            <span className="font-serif text-[20px] font-semibold">A</span>
          </Button>
        </div>
      </div>
      <Button
        variant={showChords ? "secondary" : "outline"}
        onPress={() => onShowChordsChange(!showChords)}
        aria-pressed={showChords}
        fullWidth
        className="flex items-center gap-[7px] px-[13px] py-[9px] font-sans text-[13px] font-semibold shrink-0 h-auto"
      >
        <Music size={16} aria-hidden="true" /> Acordes
      </Button>
    </div>
  );
}
