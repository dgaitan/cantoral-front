"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es">
      <body className="min-h-screen flex items-center justify-center bg-paper text-ink font-sans px-5 text-center">
        <div>
          <h1 className="font-serif font-semibold text-[30px] mb-4">Algo salió mal</h1>
          <p className="text-muted mb-8 max-w-[480px] mx-auto">
            Ocurrió un error inesperado. Intenta de nuevo en unos momentos.
          </p>
          <button onClick={() => reset()} className="button button--primary font-semibold">
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
