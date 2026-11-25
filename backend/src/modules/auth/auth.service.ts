import { AppError } from "../../errors/app-error.js";
import { verifyPassword } from "../../lib/password/index.js";
import { prisma } from "../../lib/prisma.js";
import { signAccessToken } from "../../lib/token/index.js";

const DUMMY_PASSWORD_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$jRKFl/spKpc1Lj41cPNt5Q$BNdLw1RHInVJ5rFg+yhFrindQjImrSYRJdylMg2wc0U";

export interface LoginInput {
  username: string;
  password: string;
}

export interface PublicUser {
  id: string;
  username: string;
  name: string;
}

export interface LoginResult {
  token: string;
  expiresIn: number;
  user: PublicUser;
}

export async function login({ username, password }: LoginInput): Promise<LoginResult> {
  const user = await prisma.user.findUnique({ where: { username } });

  const passwordMatches = await verifyPassword(user?.passwordHash ?? DUMMY_PASSWORD_HASH, password);

  if (!user || !passwordMatches) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Usuario o contraseña incorrectos.");
  }

  const { token, expiresIn } = await signAccessToken(user.id);

  return {
    token,
    expiresIn,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
    },
  };
}
