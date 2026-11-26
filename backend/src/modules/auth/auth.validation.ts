import { AppError } from "../../errors/app-error.js";
import type { LoginInput } from "./auth.service.js";

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 32;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

export function validateUsername(username: string): string | undefined {
  if (username.length === 0) {
    return "El usuario es obligatorio.";
  }

  if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
    return `El usuario debe tener entre ${USERNAME_MIN_LENGTH} y ${USERNAME_MAX_LENGTH} caracteres.`;
  }

  if (!USERNAME_PATTERN.test(username)) {
    return "El usuario solo admite letras, números, puntos, guiones y guiones bajos.";
  }

  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (password.length === 0) {
    return "La contraseña es obligatoria.";
  }

  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    return `La contraseña debe tener entre ${PASSWORD_MIN_LENGTH} y ${PASSWORD_MAX_LENGTH} caracteres.`;
  }

  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseLoginInput(body: unknown): LoginInput {
  if (!isRecord(body)) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "El cuerpo de la solicitud debe ser un objeto JSON.",
    );
  }

  const fieldErrors: Record<string, string> = {};
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  const usernameError = validateUsername(username);
  const passwordError = validatePassword(password);

  if (usernameError) {
    fieldErrors.username = usernameError;
  }

  if (passwordError) {
    fieldErrors.password = passwordError;
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "Datos de inicio de sesión inválidos.",
      fieldErrors,
    );
  }

  return { username, password };
}
