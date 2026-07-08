"use client";

import { useEffect } from "react";
import { Container } from "@/components/templates/Grid/Container";
import { Heading } from "@/components/atoms/Heading/Heading";

export default function ErrorPage({
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
    <Container as="main" id="contenido" tabIndex={-1} className="px-5 py-24 text-center">
      <Heading size="lg" eyebrow="Algo salió mal">
        No pudimos cargar esta página
      </Heading>
      <p className="text-muted mt-4 mb-8 font-sans max-w-[480px] mx-auto">
        Ocurrió un error inesperado. Intenta de nuevo en unos momentos.
      </p>
      <button onClick={() => reset()} className="button button--primary font-semibold">
        Intentar de nuevo
      </button>
    </Container>
  );
}
