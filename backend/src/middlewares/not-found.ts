import type { RequestHandler } from "express";

import { AppError } from "../errors/app-error.js";

export const notFound: RequestHandler = (req, _res, next) => {
  next(new AppError(404, "NOT_FOUND", `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};
