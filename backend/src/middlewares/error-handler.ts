import type { ErrorRequestHandler } from "express";

import { isDevelopment } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import { logger } from "../lib/logger.js";

type ErrorWithStatus = Error & {
  status?: number;
  statusCode?: number;
};

const ERROR_CODES: Record<number, string> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  413: "PAYLOAD_TOO_LARGE",
  415: "UNSUPPORTED_MEDIA_TYPE",
  422: "UNPROCESSABLE_ENTITY",
  429: "TOO_MANY_REQUESTS",
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const appError = error instanceof AppError ? error : null;
  const statusCode = appError?.statusCode ?? getHttpStatus(error);
  const code =
    appError?.code ??
    ERROR_CODES[statusCode] ??
    (statusCode >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR");

  const message =
    appError?.message ??
    (statusCode >= 500 && !isDevelopment
      ? "Error interno del servidor"
      : error instanceof Error
        ? error.message
        : "Error interno del servidor");

  const logPayload = { err: error, statusCode, code };

  if (statusCode >= 500) {
    logger.error(logPayload, message);
  } else {
    logger.warn(logPayload, message);
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(appError?.details !== undefined && (statusCode < 500 || isDevelopment)
        ? { details: appError.details }
        : {}),
    },
  });
};

function getHttpStatus(error: unknown): number {
  if (typeof error === "object" && error !== null) {
    const candidate = error as ErrorWithStatus;

    if (candidate.statusCode && Number.isInteger(candidate.statusCode)) {
      return candidate.statusCode;
    }

    if (candidate.status && Number.isInteger(candidate.status)) {
      return candidate.status;
    }
  }

  return 500;
}
