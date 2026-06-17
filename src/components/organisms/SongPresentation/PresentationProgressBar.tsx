import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PresentationProgressBarProps } from "@/types/song";

export function PresentationProgressBar({
  current,
  total,
  onPrev,
  onNext,
}: PresentationProgressBarProps) {
  const isFirst = current === 0;
  const isLast = current === total - 1;
  const progress = total > 1 ? (current / (total - 1)) * 100 : 100;

  return (
    <div className="flex items-center gap-4 px-6 pb-6 pt-2">
      <div className="w-9 h-9 flex items-center justify-center shrink-0">
        {!isFirst && (
          <button
            onClick={onPrev}
            aria-label="Diapositiva anterior"
            className="w-9 h-9 rounded-full bg-white/12 border border-white/20 flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      <div
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label="Progreso de la presentación"
        className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-white/60 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="w-9 h-9 flex items-center justify-center shrink-0">
        {!isLast && (
          <button
            onClick={onNext}
            aria-label="Siguiente diapositiva"
            className="w-9 h-9 rounded-full bg-white/12 border border-white/20 flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
