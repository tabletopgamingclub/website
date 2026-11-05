import type { RequestHandler } from "express";

import { logger } from "../../lib/logger.js";
import { prisma } from "../../lib/prisma.js";

export const getHealth: RequestHandler = (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

export const getReadiness: RequestHandler = async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ready",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.warn({ err: error }, "La base de datos no está disponible");

    res.status(503).json({
      status: "not_ready",
      timestamp: new Date().toISOString(),
    });
  }
};
