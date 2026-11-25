import type { AccessToken, AccessTokenPayload } from "./access-token-service.js";
import { joseAccessTokenService } from "./jose-access-token-service.js";

export function signAccessToken(userId: string): Promise<AccessToken> {
  return joseAccessTokenService.sign(userId);
}

export function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  return joseAccessTokenService.verify(token);
}

export type {
  AccessToken,
  AccessTokenPayload,
  AccessTokenService,
} from "./access-token-service.js";
