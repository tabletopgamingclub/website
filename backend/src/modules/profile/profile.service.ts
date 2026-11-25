import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";

export interface Profile {
  id: string;
  username: string;
  name: string;
}

export async function getProfile(userId: string): Promise<Profile> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, name: true },
  });

  if (!user) {
    throw new AppError(401, "UNAUTHORIZED", "La sesión ya no es válida.");
  }

  return user;
}
