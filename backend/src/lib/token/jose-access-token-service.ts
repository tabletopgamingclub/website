import { SignJWT, jwtVerify } from "jose";
import { env } from "../../config/env.js";
import type {
  AccessToken,
  AccessTokenPayload,
  AccessTokenService,
} from "./access-token-service.js";
import { durationToSeconds } from "./duration.js";

const ACCESS_TOKEN_TYPE = "access";
const ALGORITHM = "HS256";
const secretKey = new TextEncoder().encode(env.jwt.accessSecret);
const expiresIn = durationToSeconds(env.jwt.accessExpiresIn);

export const joseAccessTokenService: AccessTokenService = {
  async sign(userId): Promise<AccessToken> {
    const token = await new SignJWT({ type: ACCESS_TOKEN_TYPE })
      .setProtectedHeader({ alg: ALGORITHM, typ: "JWT" })
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime(env.jwt.accessExpiresIn)
      .sign(secretKey);

    return { token, expiresIn };
  },

  async verify(token): Promise<AccessTokenPayload | null> {
    try {
      const { payload } = await jwtVerify(token, secretKey, {
        algorithms: [ALGORITHM],
      });

      if (payload.type !== ACCESS_TOKEN_TYPE || typeof payload.sub !== "string") {
        return null;
      }

      return { userId: payload.sub };
    } catch {
      return null;
    }
  },
};
