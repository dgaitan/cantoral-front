"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, InputGroup, FieldError, Button } from "@heroui/react";
import { User, Mail, Lock } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Ingresa tu nombre"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  loading?: boolean;
}

export function RegisterForm({ onSubmit, loading = false }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <form
      onSubmit={handleSubmit(({ name, email, password }) => onSubmit(name, email, password))}
      className="w-full flex flex-col gap-3"
      noValidate
    >
      <TextField isInvalid={!!errors.name}>
        <InputGroup>
          <InputGroup.Prefix>
            <User size={16} className="text-default-400" />
          </InputGroup.Prefix>
          <InputGroup.Input
            type="text"
            autoComplete="name"
            placeholder="Tu nombre"
            {...register("name")}
          />
        </InputGroup>
        <FieldError>{errors.name?.message}</FieldError>
      </TextField>

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
            autoComplete="new-password"
            placeholder="Contraseña (mín. 8 caracteres)"
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
        {loading ? "Enviando…" : "Crear cuenta"}
      </Button>
    </form>
  );
}
