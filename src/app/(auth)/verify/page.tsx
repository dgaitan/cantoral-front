"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toast, InputOTP, REGEXP_ONLY_DIGITS } from "@heroui/react";
import { AuthCard } from "@/components/organisms/AuthCard/AuthCard";
import { useAuth } from "@/hooks/useAuth";
import { extractApiError } from "@/lib/utils/api-error";

export default function VerifyPage() {
  const router = useRouter();
  const { verifyToken } = useAuth();
  const [email] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("cc_pending_email");
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) router.replace("/login");
  }, [email, router]);

  async function handleComplete(code: string) {
    if (!email || loading) return;
    setLoading(true);
    try {
      await verifyToken(email, code);
      sessionStorage.removeItem("cc_pending_email");
      router.push("/perfil");
    } catch (error) {
      Toast.toast.danger(
        extractApiError(error, "Código inválido o expirado. Intenta nuevamente.")
      );
      setOtp("");
    } finally {
      setLoading(false);
    }
  }

  if (!email) return null;

  return (
    <AuthCard title="Ingresa el código">
      <p className="text-sm text-muted text-center mb-8 leading-relaxed">
        Enviamos un código de 6 dígitos a{" "}
        <strong className="text-ink">{email}</strong>
      </p>
      <InputOTP
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        value={otp}
        onChange={setOtp}
        onComplete={handleComplete}
        isDisabled={loading}
      >
        <InputOTP.Group className="gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <InputOTP.Slot key={i} index={i} />
          ))}
        </InputOTP.Group>
      </InputOTP>
    </AuthCard>
  );
}
