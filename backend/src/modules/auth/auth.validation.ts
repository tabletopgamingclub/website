import { AppError } from "../../errors/app-error.js";
import type { LoginInput } from "./auth.service.js";

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 32;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

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

  if (username.length === 0) {
    fieldErrors.username = "El usuario es obligatorio.";
  } else if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
    fieldErrors.username = `El usuario debe tener entre ${USERNAME_MIN_LENGTH} y ${USERNAME_MAX_LENGTH} caracteres.`;
  } else if (!USERNAME_PATTERN.test(username)) {
    fieldErrors.username =
      "El usuario solo admite letras, números, puntos, guiones y guiones bajos.";
  }

  if (password.length === 0) {
    fieldErrors.password = "La contraseña es obligatoria.";
  } else if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    fieldErrors.password = `La contraseña debe tener entre ${PASSWORD_MIN_LENGTH} y ${PASSWORD_MAX_LENGTH} caracteres.`;
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
