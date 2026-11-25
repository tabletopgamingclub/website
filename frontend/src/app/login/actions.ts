"use server";

import { redirect } from "next/navigation";

import { isUnauthorizedError, loginRequest } from "@/lib/backend";
import { setSession } from "@/lib/session";

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 32;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

export interface LoginState {
  errors?: {
    username?: string;
    password?: string;
  };
  message?: string;
}

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);

  return typeof value === "string" ? value : "";
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = readField(formData, "username").trim();
  const password = readField(formData, "password");
  const errors: NonNullable<LoginState["errors"]> = {};

  if (username.length === 0) {
    errors.username = "El usuario es obligatorio.";
  } else if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
    errors.username = `El usuario debe tener entre ${USERNAME_MIN_LENGTH} y ${USERNAME_MAX_LENGTH} caracteres.`;
  } else if (!USERNAME_PATTERN.test(username)) {
    errors.username = "El usuario solo admite letras, números, puntos, guiones y guiones bajos.";
  }

  if (password.length === 0) {
    errors.password = "La contraseña es obligatoria.";
  } else if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    errors.password = `La contraseña debe tener entre ${PASSWORD_MIN_LENGTH} y ${PASSWORD_MAX_LENGTH} caracteres.`;
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  let session: Awaited<ReturnType<typeof loginRequest>>;

  try {
    session = await loginRequest(username, password);
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return { message: "Usuario o contraseña incorrectos." };
    }

    return { message: "No se pudo iniciar sesión. Intentá de nuevo en unos minutos." };
  }

  await setSession(session.token, session.expiresIn);
  redirect("/profile");
}
