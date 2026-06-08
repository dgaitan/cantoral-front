"use client";

import { useEffect, useRef } from "react";
interface RevealPresentationProps {
  slides: string[];
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
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!deckRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let deck: any = null;

    import("reveal.js").then(({ default: Reveal }) => {
      if (!deckRef.current) return;
      deck = new Reveal(deckRef.current, {
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
      deck.initialize();
    });

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      deck?.destroy();
    };
  }, []);

  return (
    <div
      className="reveal w-full h-full"
      ref={deckRef}
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
            <pre className="whitespace-pre-wrap text-left font-mono leading-relaxed">
              {slide}
            </pre>
          </section>
        ))}
      </div>
    </div>
  );
}
