import "dotenv/config";

const NODE_ENVS = ["development", "production", "test"] as const;
const LOG_LEVELS = ["fatal", "error", "warn", "info", "debug", "trace", "silent"] as const;
const DEFAULT_CORS_ORIGIN = "http://localhost:3001";

type NodeEnv = (typeof NODE_ENVS)[number];
type LogLevel = (typeof LOG_LEVELS)[number];

function parseNodeEnv(value: string | undefined): NodeEnv {
  const nodeEnv = value ?? "development";

  if (!NODE_ENVS.includes(nodeEnv as NodeEnv)) {
    throw new Error(
      `NODE_ENV inválido: "${nodeEnv}". Valores permitidos: ${NODE_ENVS.join(", ")}.`,
    );
  }

  return nodeEnv as NodeEnv;
}

function parsePort(value: string | undefined): number {
  if (value === undefined || value.trim() === "") {
    return 3000;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`PORT inválido: "${value}". Debe ser un entero entre 1 y 65535.`);
  }

  return port;
}

function parseLogLevel(value: string | undefined): LogLevel {
  const logLevel = value ?? "info";

  if (!LOG_LEVELS.includes(logLevel as LogLevel)) {
    throw new Error(
      `LOG_LEVEL inválido: "${logLevel}". Valores permitidos: ${LOG_LEVELS.join(", ")}.`,
    );
  }

  return logLevel as LogLevel;
}

function parseCorsOrigins(value: string | undefined, nodeEnv: NodeEnv): string[] {
  const raw = value?.trim();

  if (!raw) {
    if (nodeEnv === "production") {
      throw new Error(
        "CORS_ORIGIN es obligatoria en producción. Definí el origen del frontend, por ejemplo https://mi-app.vercel.app.",
      );
    }

    return [DEFAULT_CORS_ORIGIN];
  }

  const origins = raw
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (origins.length === 0) {
    throw new Error("CORS_ORIGIN no contiene orígenes válidos.");
  }

  const normalized = origins.map((origin) => {
    if (origin === "*") {
      throw new Error("CORS_ORIGIN no admite '*'. Indicá los orígenes explícitos.");
    }

    let url: URL;

    try {
      url = new URL(origin);
    } catch {
      throw new Error(`CORS_ORIGIN inválido: "${origin}".`);
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error(`CORS_ORIGIN inválido: "${origin}". Solo se admiten http y https.`);
    }

    if (url.pathname !== "/" || url.search !== "" || url.hash !== "") {
      throw new Error(`CORS_ORIGIN inválido: "${origin}". Indicá solo el origen, sin ruta.`);
    }

    return url.origin;
  });

  return [...new Set(normalized)];
}

function requireDatabaseUrl(value: string | undefined): string {
  if (value === undefined || value.trim() === "") {
    throw new Error(
      "DATABASE_URL es obligatoria. Copiá backend/.env.example a backend/.env y configurala.",
    );
  }

  return value;
}

const nodeEnv = parseNodeEnv(process.env.NODE_ENV);

export const env = {
  nodeEnv,
  port: parsePort(process.env.PORT),
  logLevel: parseLogLevel(process.env.LOG_LEVEL),
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN, nodeEnv),
  databaseUrl: requireDatabaseUrl(process.env.DATABASE_URL),
} as const;

export const isDevelopment = nodeEnv === "development";
