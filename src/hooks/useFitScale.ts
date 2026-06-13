"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MIN_SCALE = 0.45;
const MAX_SCALE = 1.0;

interface UseFitScaleOptions {
  deps?: unknown[];
}

interface UseFitScaleResult {
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  scale: number;
  naturalHeight: number;
}

export function useFitScale({ deps = [] }: UseFitScaleOptions = {}): UseFitScaleResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(MAX_SCALE);
  const [naturalHeight, setNaturalHeight] = useState(0);

  const recalculate = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // CSS transforms are off-layout: scrollWidth/scrollHeight always reflect
    // the element's natural dimensions regardless of any applied transform.
    const containerWidth = container.clientWidth;
    const contentWidth = content.scrollWidth;
    const contentHeight = content.scrollHeight;

    if (!containerWidth || !contentWidth) return;

    setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, containerWidth / contentWidth)));
    setNaturalHeight(contentHeight);
  }, []);

  // Runs on mount and whenever deps (e.g. fontSize, content) change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(recalculate, deps);

  // Recomputes scale when the container is resized (window resize, orientation change).
  // Does NOT call recalculate() on setup — the deps effect above handles the initial measurement.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(recalculate);
    ro.observe(container);
    return () => ro.disconnect();
  }, [recalculate]);

  return { containerRef, contentRef, scale, naturalHeight };
}
