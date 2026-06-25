"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toast } from "@heroui/react";
import { AuthCard } from "@/components/organisms/AuthCard/AuthCard";
import { LoginForm } from "@/components/molecules/LoginForm/LoginForm";
import { login } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(email: string, password: string) {
    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);
    if (!res.ok) {
      Toast.toast.danger(res.error);
      return;
    }
    sessionStorage.setItem("cc_pending_email", email);
    Toast.toast.success("Revisa tu correo para obtener el código de acceso.");
    router.push("/verify");
  }

  return (
    <AuthCard
      title="Ingresar"
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-orange font-semibold">
            Crear cuenta
          </a>
        </>
      }
    >
      <LoginForm onSubmit={handleSubmit} loading={loading} />
    </AuthCard>
  );
}
