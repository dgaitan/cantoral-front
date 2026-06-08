"use client";

import { useEffect } from "react";

interface PresentationLayoutProps {
  children: React.ReactNode;
}

export function PresentationLayout({ children }: PresentationLayoutProps) {
  useEffect(() => {
    const ids = ["reveal-core-css", "reveal-theme-css"];
    const hrefs = ["/reveal.css", "/reveal-theme-black.css"];

    hrefs.forEach((href, i) => {
      if (!document.getElementById(ids[i]!)) {
        const link = document.createElement("link");
        link.id = ids[i]!;
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      }
    });
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      data-testid="presentation-layout"
    >
      {children}
    </div>
  );
}
