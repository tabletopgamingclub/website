import pino from "pino";

import { env, isDevelopment } from "../config/env.js";

const devOptions = {
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
};

export const logger = pino({
  level: env.logLevel,
  ...(isDevelopment ? devOptions : {}),
});
