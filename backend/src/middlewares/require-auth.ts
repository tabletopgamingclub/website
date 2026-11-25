import type { RequestHandler } from "express";

import { AppError } from "../errors/app-error.js";
import { verifyAccessToken } from "../lib/token/index.js";

const BEARER_PATTERN = /^Bearer\s+(\S+)$/i;

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const header = req.get("authorization");
  const token = header?.match(BEARER_PATTERN)?.[1];

  if (!token) {
    next(new AppError(401, "UNAUTHORIZED", "Se requiere autenticación."));
    return;
  }

  const payload = await verifyAccessToken(token);

  if (!payload) {
    next(new AppError(401, "UNAUTHORIZED", "La sesión no es válida o venció."));
    return;
  }

  req.user = payload;
  next();
};
