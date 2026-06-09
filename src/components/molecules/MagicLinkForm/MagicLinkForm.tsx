"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Input, FieldError, Button } from "@heroui/react";

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
      <TextField isInvalid={!!errors.email}>
        <Input
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          {...register("email")}
        />
        <FieldError>{errors.email?.message}</FieldError>
      </TextField>
      <Button
        type="submit"
        isDisabled={loading}
        className="w-full font-semibold bg-orange text-white"
      >
        {loading ? "Enviando…" : "Enviar enlace"}
      </Button>
    </form>
  );
}
