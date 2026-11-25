import type { AccessTokenPayload } from "../lib/token/index.js";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export {};
