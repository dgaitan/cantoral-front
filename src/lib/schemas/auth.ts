import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Ingresa tu nombre"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const magicLinkSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
});

export const otpSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
  token: z.string().min(4, "Ingresa el código que recibiste"),
});

export const verifyMagicSchema = z.object({
  email: z.string().email("Correo inválido"),
  token: z.string().min(1, "Token inválido"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
