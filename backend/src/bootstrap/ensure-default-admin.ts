import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";
import { hashPassword } from "../lib/password/index.js";
import { prisma } from "../lib/prisma.js";
import { ROLES } from "../lib/roles.js";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_PATTERN,
} from "../modules/auth/auth.validation.js";

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

function parseDefaultAdminConfig(config: typeof env.defaultAdmin): DefaultAdminConfig {
  const missing = [
    !config.username && "DEFAULT_ADMIN_USERNAME",
    !config.name && "DEFAULT_ADMIN_NAME",
    !config.password && "DEFAULT_ADMIN_PASSWORD",
  ].filter((name): name is string => typeof name === "string");

  if (!config.username || !config.name || !config.password) {
    throw new Error(
      `No existe ningún administrador y faltan variables para crear el inicial: ${missing.join(", ")}. Definilas en backend/.env.`,
    );
  }

  const { username, name, password } = config;

  if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
    throw new Error(
      `DEFAULT_ADMIN_USERNAME debe tener entre ${USERNAME_MIN_LENGTH} y ${USERNAME_MAX_LENGTH} caracteres.`,
    );
  }

  if (!USERNAME_PATTERN.test(username)) {
    throw new Error(
      "DEFAULT_ADMIN_USERNAME solo admite letras, números, puntos, guiones y guiones bajos.",
    );
  }

  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    throw new Error(
      `DEFAULT_ADMIN_PASSWORD debe tener entre ${PASSWORD_MIN_LENGTH} y ${PASSWORD_MAX_LENGTH} caracteres.`,
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
