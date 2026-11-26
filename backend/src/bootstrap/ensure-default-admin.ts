import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";
import { hashPassword } from "../lib/password/index.js";
import { prisma } from "../lib/prisma.js";
import { ROLES } from "../lib/roles.js";
import { validatePassword, validateUsername } from "../modules/auth/auth.validation.js";

interface DefaultAdminConfig {
  username: string;
  name: string;
  password: string;
}

export async function ensureDefaultAdmin(): Promise<void> {
  if (await adminExists()) {
    logger.debug("Ya existe un administrador; no se crea el inicial.");
    return;
  }

  const { username, name, password } = parseDefaultAdminConfig(env.defaultAdmin);

  const existingUser = await prisma.user.findUnique({
    where: { username },
    select: { role: true },
  });

  if (existingUser) {
    throw new Error(
      `No se pudo crear el administrador inicial: el usuario "${username}" ya existe con rol ${existingUser.role}. Elegí otro valor para DEFAULT_ADMIN_USERNAME.`,
    );
  }

  const passwordHash = await hashPassword(password);

  try {
    await prisma.user.create({
      data: { username, name, passwordHash, role: ROLES.admin },
      select: { id: true },
    });
  } catch (error) {
    if (getErrorCode(error) === "P2002" && (await adminExists())) {
      logger.debug("Otra instancia creó el administrador inicial.");
      return;
    }

    throw new Error(
      `No se pudo crear el administrador inicial (código ${getErrorCode(error) ?? "desconocido"}).`,
    );
  }

  logger.info({ username }, "Se creó el administrador inicial.");
}

async function adminExists(): Promise<boolean> {
  const admin = await prisma.user.findFirst({
    where: { role: ROLES.admin },
    select: { id: true },
  });

  return admin !== null;
}

function parseDefaultAdminConfig({
  username = "",
  name = "",
  password = "",
}: typeof env.defaultAdmin): DefaultAdminConfig {
  const fieldErrors: Record<string, string> = {};
  const usernameError = validateUsername(username);
  const passwordError = validatePassword(password);

  if (usernameError) {
    fieldErrors.DEFAULT_ADMIN_USERNAME = usernameError;
  }

  if (name.length === 0) {
    fieldErrors.DEFAULT_ADMIN_NAME = "El nombre es obligatorio.";
  }

  if (passwordError) {
    fieldErrors.DEFAULT_ADMIN_PASSWORD = passwordError;
  }

  if (Object.keys(fieldErrors).length > 0) {
    const details = Object.entries(fieldErrors)
      .map(([variable, message]) => `${variable}: ${message}`)
      .join(" ");

    throw new Error(
      `No existe ningún administrador y las variables del administrador inicial son inválidas. ${details} Corregilas en backend/.env.`,
    );
  }

  return { username, name, password };
}

function getErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    const { code } = error as { code: unknown };

    return typeof code === "string" ? code : undefined;
  }

  return undefined;
}
