"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Logo } from "@/components/atoms/Logo/Logo";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
  name: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

type Tab = "ingresar" | "crear";

export default function LoginPage() {
  const { login } = useAuth();
  const [tab, setTab] = useState<Tab>("ingresar");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function switchTab(next: Tab) {
    setTab(next);
    setSent(false);
    setServerError(null);
    reset();
  }

  async function onSubmit({ email }: FormValues) {
    setLoading(true);
    setServerError(null);
    try {
      await login(email);
      setSent(true);
    } catch {
      setServerError("No se pudo enviar el enlace. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "0 24px" }}>
        <Logo size={26} />
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: 24,
            fontWeight: 600,
            color: "var(--ink)",
            margin: "20px 0 8px",
          }}
        >
          Revisa tu correo
        </h2>
        <p
          style={{
            fontFamily: "var(--font-hanken)",
            color: "var(--muted)",
            lineHeight: 1.5,
          }}
        >
          Te enviamos un enlace mágico para{" "}
          {tab === "crear" ? "crear tu cuenta" : "ingresar"}.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 380,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        padding: "0 4px",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 28 }}>
        <Logo size={26} />
      </div>

      {/* Segmented tabs */}
      <div
        style={{
          display: "flex",
          background: "var(--paper-2)",
          borderRadius: 14,
          padding: 4,
          marginBottom: 24,
          width: "100%",
        }}
      >
        {(["ingresar", "crear"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 11,
              border: "none",
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "var(--ink)" : "var(--muted)",
              fontFamily: "var(--font-hanken)",
              fontWeight: tab === t ? 700 : 600,
              fontSize: 14,
              cursor: "pointer",
              boxShadow:
                tab === t
                  ? "0 1px 4px rgba(10,29,43,0.1)"
                  : "none",
              transition: "all 0.15s",
            }}
          >
            {t === "ingresar" ? "Ingresar" : "Crear cuenta"}
          </button>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}
      >
        {tab === "crear" && (
          <div style={{ position: "relative" }}>
            <input
              type="text"
              autoComplete="name"
              placeholder="Tu nombre"
              style={inputStyle(!!errors.name)}
              {...register("name")}
            />
          </div>
        )}

        <div style={{ position: "relative" }}>
          <Mail
            size={16}
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            style={{ ...inputStyle(!!errors.email), paddingLeft: 40 }}
            {...register("email")}
          />
          {errors.email && (
            <p
              style={{
                fontFamily: "var(--font-hanken)",
                fontSize: 12,
                color: "#c0392b",
                marginTop: 4,
              }}
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {serverError && (
          <p
            style={{
              fontFamily: "var(--font-hanken)",
              fontSize: 13,
              color: "#c0392b",
              textAlign: "center",
            }}
          >
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            height: 50,
            borderRadius: 14,
            border: "none",
            background: loading ? "var(--muted)" : "var(--orange)",
            color: "#fff",
            fontFamily: "var(--font-hanken)",
            fontWeight: 700,
            fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: 4,
            transition: "background 0.15s",
          }}
        >
          {loading ? "Enviando…" : "Enviar enlace"}
        </button>
      </form>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: "100%",
          margin: "20px 0",
        }}
      >
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <span
          style={{
            fontFamily: "var(--font-hanken)",
            fontSize: 12,
            color: "var(--muted)",
          }}
        >
          o continúa con
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>

      {/* Google btn (placeholder) */}
      <button
        type="button"
        disabled
        style={{
          width: "100%",
          height: 48,
          borderRadius: 14,
          border: "1.5px solid var(--line)",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontFamily: "var(--font-hanken)",
          fontWeight: 600,
          fontSize: 14,
          color: "var(--ink)",
          cursor: "not-allowed",
          opacity: 0.5,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continuar con Google
      </button>

      {/* Footer */}
      <p
        style={{
          fontFamily: "var(--font-hanken)",
          fontSize: 11.5,
          color: "var(--muted)",
          textAlign: "center",
          marginTop: 20,
          lineHeight: 1.6,
        }}
      >
        Al continuar aceptas nuestros{" "}
        <span style={{ color: "var(--orange)", cursor: "pointer" }}>
          Términos de uso
        </span>{" "}
        y{" "}
        <span style={{ color: "var(--orange)", cursor: "pointer" }}>
          Política de privacidad
        </span>
        .
      </p>
    </div>
  );
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    height: 50,
    borderRadius: 14,
    border: `1.5px solid ${hasError ? "#c0392b" : "var(--line)"}`,
    background: "#fff",
    padding: "0 16px",
    fontFamily: "var(--font-hanken)",
    fontSize: 15,
    color: "var(--ink)",
    outline: "none",
    boxSizing: "border-box",
  };
}
