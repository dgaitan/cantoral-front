"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toast } from "@heroui/react";
import { AuthCard } from "@/components/organisms/AuthCard/AuthCard";
import { RegisterForm } from "@/components/molecules/RegisterForm/RegisterForm";
import { register } from "@/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(name: string, email: string, password: string) {
    setLoading(true);
    const res = await register({ name, email, password });
    setLoading(false);
    if (!res.ok) {
      Toast.toast.danger(res.error);
      return;
    }
    sessionStorage.setItem("cc_pending_email", email);
    Toast.toast.success("Revisa tu correo para obtener el código de verificación.");
    router.push("/verify");
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
