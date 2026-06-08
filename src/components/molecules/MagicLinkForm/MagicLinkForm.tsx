"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils/cn";

const schema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
});

type FormValues = z.infer<typeof schema>;

interface MagicLinkFormProps {
  onSubmit: (email: string) => Promise<void>;
  loading?: boolean;
}

export function MagicLinkForm({ onSubmit, loading = false }: MagicLinkFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <form
      onSubmit={handleSubmit(({ email }) => onSubmit(email))}
      className="flex flex-col gap-4 w-full max-w-sm"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          className={cn(
            "rounded-xl border border-default-200 bg-content1 px-4 py-2 text-sm",
            "outline-none focus:border-primary transition-colors",
            errors.email && "border-danger"
          )}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-danger">{errors.email.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-50 transition-opacity"
      >
        {loading ? "Enviando…" : "Enviar enlace"}
      </button>
    </form>
  );
}
