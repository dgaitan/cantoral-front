"use client";

import { useEffect, useRef } from "react";
import type { RevealApi } from "reveal.js";
import type { PresentationSlide } from "@/lib/lyrics/parser";

interface RevealPresentationProps {
  slides: PresentationSlide[];
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
}

export function RevealPresentation({
  slides,
  bgColor,
  textColor,
  fontSize,
}: RevealPresentationProps) {
  const deckDivRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<RevealApi | null>(null);

  useEffect(() => {
    if (!slides.length) return;

    // Destroy any existing instance before reinitializing with new slide content
    if (deckRef.current) {
      try {
        deckRef.current.destroy();
      } catch {
        // Reveal.js destroy can throw a parentNode error if the DOM has already changed
      }
      deckRef.current = null;
    }

    import("reveal.js").then(({ default: Reveal }) => {
      if (!deckDivRef.current) return;
      const deck = new Reveal(deckDivRef.current, {
        hash: false,
        controls: true,
        progress: true,
        center: true,
        transition: "slide",
        backgroundTransition: "fade",
        touch: true,
        keyboard: true,
        embedded: false,
      });
      // Assign ref immediately so cleanup can destroy it even if initialize() is pending
      deckRef.current = deck;
      deck.initialize().catch(() => {});
    });

    return () => {
      try {
        deckRef.current?.destroy();
      } catch {
        // Known Reveal.js issue: parentNode error on unmount
      }
      deckRef.current = null;
    };
  }, [slides]);

  return (
    <div
      className="reveal w-full h-full"
      ref={deckDivRef}
      data-testid="reveal-presentation"
      style={
        {
          "--r-background-color": bgColor ?? "#191919",
          "--r-main-color": textColor ?? "#ffffff",
          fontSize: fontSize ? `${fontSize}px` : undefined,
        } as React.CSSProperties
      }
    >
      <div className="slides">
        {slides.map((slide, i) => (
          <section key={i}>
            {slide.label && (
              <p className="font-[var(--font-hanken)] text-[11px] font-bold tracking-[0.14em] uppercase text-white/40 mb-2">
                {slide.label}
              </p>
            )}
            <div
              className="font-[var(--font-newsreader)] leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: slide.content }}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
