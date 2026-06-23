"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { verifyMagic } from "@/actions/auth";

function VerificarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refresh } = useAuth();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(
    !email || !token ? "Enlace inválido. Faltan parámetros." : null
  );

  useEffect(() => {
    if (!email || !token) return;
    verifyMagic({ email, token }).then(async (res) => {
      if (res.ok) {
        await refresh();
        router.replace("/dashboard");
      } else {
        setError(res.error);
      }
    });
  }, [email, token, refresh, router]);

  if (error) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-bold text-danger mb-2">Error</h1>
        <p className="text-foreground/60">{error}</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-foreground/60">Verificando enlace…</p>
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
