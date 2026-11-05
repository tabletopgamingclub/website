import { createServer } from "node:http";

import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { prisma } from "./lib/prisma.js";

const server = createServer(app);

server.on("error", (error) => {
  logger.fatal({ err: error }, "No se pudo iniciar el servidor");
  process.exit(1);
});

server.listen(env.port, () => {
  logger.info(`API disponible en http://localhost:${env.port}/api`);
});

let shuttingDown = false;

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  if (shuttingDown) return;

  shuttingDown = true;
  logger.info({ signal }, "Cerrando servidor");

  const forceExit = setTimeout(() => {
    logger.error("Cierre forzado: el servidor no respondió a tiempo");
    process.exit(1);
  }, 10_000);

  forceExit.unref();

  try {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
      server.closeIdleConnections();
    });
  } catch (error) {
    logger.error({ err: error }, "Error durante el cierre del servidor");
    process.exitCode = 1;
  } finally {
    try {
      await prisma.$disconnect();
    } catch (error) {
      logger.error({ err: error }, "Error al desconectar Prisma");
      process.exitCode = 1;
    }

    const exitCode = process.exitCode ?? 0;

    logger.flush(() => {
      clearTimeout(forceExit);
      process.exit(exitCode);
    });
  }
};

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    if (shuttingDown) {
      logger.warn({ signal }, "Segundo cierre: salida forzada");
      process.exit(1);
    }

    void shutdown(signal);
  });
}

process.on("uncaughtException", (error) => {
  logger.fatal({ err: error }, "Excepción no controlada");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.fatal({ err: reason }, "Promesa rechazada sin manejar");
  process.exitCode = 1;
  void shutdown("SIGTERM");
});
