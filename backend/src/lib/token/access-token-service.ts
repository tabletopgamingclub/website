export interface AccessToken {
  token: string;
  expiresIn: number;
}

export interface AccessTokenPayload {
  userId: string;
}

export interface AccessTokenService {
  sign(userId: string): Promise<AccessToken>;
  verify(token: string): Promise<AccessTokenPayload | null>;
}
