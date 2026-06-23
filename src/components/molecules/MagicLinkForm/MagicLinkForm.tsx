"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Input, FieldError, Button } from "@heroui/react";
import { magicLinkSchema, type MagicLinkInput } from "@/lib/schemas/auth";

type FormValues = MagicLinkInput;

interface MagicLinkFormProps {
  onSubmit: (email: string) => Promise<void>;
  loading?: boolean;
}

export function MagicLinkForm({ onSubmit, loading = false }: MagicLinkFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(magicLinkSchema) });

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
