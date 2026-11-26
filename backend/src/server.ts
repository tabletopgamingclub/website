import { createServer } from "node:http";

import { app } from "./app.js";
import { ensureDefaultAdmin } from "./bootstrap/ensure-default-admin.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { prisma } from "./lib/prisma.js";

const FORCE_EXIT_TIMEOUT_MS = 10_000;

type ServerState = "starting" | "running" | "stopping";

const server = createServer(app);

let state: ServerState = "starting";
let bootstrap: Promise<void> = Promise.resolve();
let terminating: Promise<void> | undefined;

function terminate(exitCode: number): Promise<void> {
  terminating ??= (async () => {
    let code = exitCode;

    try {
      await prisma.$disconnect();
    } catch (error) {
      logger.error({ err: error }, "Error al desconectar Prisma");
      code = 1;
    }

    logger.flush(() => process.exit(code));
  })();

  return terminating;
}

function closeServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
    server.closeIdleConnections();
  });
}

async function start(): Promise<void> {
  bootstrap = ensureDefaultAdmin();

  try {
    await bootstrap;
  } catch (error) {
    if (state === "stopping") return;

    logger.fatal({ err: error }, "No se pudo crear el administrador inicial");
    await terminate(1);
    return;
  }

  if (state === "stopping") return;

  server.listen(env.port, () => {
    state = "running";
    logger.info(`API disponible en http://localhost:${env.port}/api`);
  });
}

async function shutdown(reason: string, exitCode = 0): Promise<void> {
  if (state === "stopping") return;

  const wasRunning = state === "running";
  state = "stopping";
  logger.info({ reason }, "Cerrando servidor");

  const forceExit = setTimeout(() => {
    logger.error("Cierre forzado: el servidor no respondió a tiempo");
    process.exit(1);
  }, FORCE_EXIT_TIMEOUT_MS);

  forceExit.unref();

  let code = exitCode;

  await bootstrap.catch(() => undefined);

  if (wasRunning) {
    try {
      await closeServer();
    } catch (error) {
      logger.error({ err: error }, "Error durante el cierre del servidor");
      code = 1;
    }
  }

  await terminate(code);
}

server.on("error", (error) => {
  logger.fatal({ err: error }, "No se pudo iniciar el servidor");
  void terminate(1);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    if (state === "stopping") {
      logger.warn({ signal }, "Segundo cierre: salida forzada");
      process.exit(1);
    }

    void shutdown(signal);
  });
}

process.on("uncaughtException", (error) => {
  logger.fatal({ err: error }, "Excepción no controlada");
  void terminate(1);
});

process.on("unhandledRejection", (reason) => {
  logger.fatal({ err: reason }, "Promesa rechazada sin manejar");
  void shutdown("unhandledRejection", 1);
});

void start();
