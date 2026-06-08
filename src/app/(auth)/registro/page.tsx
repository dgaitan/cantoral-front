"use client";

import { useState } from "react";
import { MagicLinkForm } from "@/components/molecules/MagicLinkForm/MagicLinkForm";
import { useAuth } from "@/hooks/useAuth";

export default function RegistroPage() {
  const { login } = useAuth();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(email: string): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      await login(email);
      setSent(true);
    } catch {
      setError("No se pudo crear la cuenta. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Revisa tu correo</h1>
        <p className="text-foreground/60">
          Te enviamos un enlace para completar tu registro.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <h1 className="text-2xl font-bold">Crear cuenta</h1>
      {error && <p className="text-sm text-danger">{error}</p>}
      <MagicLinkForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
