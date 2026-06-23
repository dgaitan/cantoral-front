"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, InputGroup, FieldError, Button } from "@heroui/react";
import { Mail, Lock } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";

type FormValues = LoginInput;

interface Props {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading?: boolean;
}

export function LoginForm({ onSubmit, loading = false }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(loginSchema) });

  return (
    <form
      onSubmit={handleSubmit(({ email, password }) => onSubmit(email, password))}
      className="w-full flex flex-col gap-3"
      noValidate
    >
      <TextField isInvalid={!!errors.email}>
        <InputGroup>
          <InputGroup.Prefix>
            <Mail size={16} className="text-default-400" />
          </InputGroup.Prefix>
          <InputGroup.Input
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            {...register("email")}
          />
        </InputGroup>
        <FieldError>{errors.email?.message}</FieldError>
      </TextField>

      <TextField isInvalid={!!errors.password}>
        <InputGroup>
          <InputGroup.Prefix>
            <Lock size={16} className="text-default-400" />
          </InputGroup.Prefix>
          <InputGroup.Input
            type="password"
            autoComplete="current-password"
            placeholder="Contraseña"
            {...register("password")}
          />
        </InputGroup>
        <FieldError>{errors.password?.message}</FieldError>
      </TextField>

      <Button
        type="submit"
        isDisabled={loading}
        className="w-full font-bold bg-orange text-white"
      >
        {loading ? "Enviando…" : "Ingresar"}
      </Button>
    </form>
  );
}
