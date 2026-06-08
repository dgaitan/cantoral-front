"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

function VerificarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyToken } = useAuth();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      setErrorMsg("Enlace inválido. Faltan parámetros.");
      setStatus("error");
      return;
    }

    verifyToken(email, token)
      .then(() => router.replace("/dashboard"))
      .catch((err: unknown) => {
        setErrorMsg(
          err instanceof Error ? err.message : "Verificación fallida."
        );
        setStatus("error");
      });
  }, [searchParams, verifyToken, router]);

  if (status === "loading") {
    return (
      <div className="text-center">
        <p className="text-foreground/60">Verificando enlace…</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-xl font-bold text-danger mb-2">Error</h1>
      <p className="text-foreground/60">{errorMsg}</p>
    </div>
  );
}

export default function VerificarPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center">
          <p className="text-foreground/60">Cargando…</p>
        </div>
      }
    >
      <VerificarContent />
    </Suspense>
  );
}
