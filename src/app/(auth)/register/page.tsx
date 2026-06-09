"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toast } from "@heroui/react";
import { AuthCard } from "@/components/organisms/AuthCard/AuthCard";
import { RegisterForm } from "@/components/molecules/RegisterForm/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import { extractApiError } from "@/lib/utils/api-error";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(name: string, email: string, password: string) {
    setLoading(true);
    try {
      await register(name, email, password);
      sessionStorage.setItem("cc_pending_email", email);
      Toast.toast.success("Revisa tu correo para obtener el código de verificación.");
      router.push("/verify");
    } catch (error) {
      Toast.toast.danger(extractApiError(error, "No se pudo crear la cuenta. Intenta nuevamente."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Crear cuenta"
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-orange font-semibold">
            Ingresar
          </a>
        </>
      }
    >
      <RegisterForm onSubmit={handleSubmit} loading={loading} />
    </AuthCard>
  );
}
