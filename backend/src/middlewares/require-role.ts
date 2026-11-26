import type { RequestHandler } from "express";

import { AppError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";
import type { UserRole } from "../lib/roles.js";

export function requireRole(...roles: UserRole[]): RequestHandler {
  return async (req, _res, next) => {
    const userId = req.user?.userId;

    if (!userId) {
      next(new AppError(401, "UNAUTHORIZED", "Se requiere autenticación."));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      next(new AppError(401, "UNAUTHORIZED", "La sesión ya no es válida."));
      return;
    }

    if (!roles.includes(user.role)) {
      next(new AppError(403, "FORBIDDEN", "No tenés permisos para acceder a este recurso."));
      return;
    }

    next();
  };
}
