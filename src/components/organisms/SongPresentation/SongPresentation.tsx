"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { SongPresentationProps, SongPresentationSlide } from "@/types/song";
import { PresentationSlide } from "./PresentationSlide";
import { PresentationProgressBar } from "./PresentationProgressBar";

const SWIPE_THRESHOLD = 50;

export function SongPresentation({
  slides,
  bgColor = "#202020",
  textColor = "#ffffff",
  fontSize = 42,
}: SongPresentationProps) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goNext = useCallback(() => {
    setCurrent((i) => Math.min(i + 1, slides.length - 1));
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrent((i) => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const delta = touchStartX.current - (e.changedTouches[0]?.clientX ?? 0);
      if (Math.abs(delta) >= SWIPE_THRESHOLD) {
        delta > 0 ? goNext() : goPrev();
      }
      touchStartX.current = null;
    },
    [goNext, goPrev]
  );

  const slide: SongPresentationSlide | undefined = slides[current];

  return (
    <div
      data-testid="song-presentation"
      className="relative w-full h-full flex flex-col"
      // Dynamic per-song theme values from backend cannot use static Tailwind classes
      style={{ backgroundColor: bgColor, color: textColor, fontSize: `${fontSize}px` } as React.CSSProperties}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slide && <PresentationSlide {...slide} />}
      <PresentationProgressBar
        current={current}
        total={slides.length}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
}
