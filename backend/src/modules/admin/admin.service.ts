import { prisma } from "../../lib/prisma.js";
import type { UserRole } from "../../lib/roles.js";

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export function listUsers(): Promise<AdminUser[]> {
  return prisma.user.findMany({
    select: { id: true, username: true, name: true, role: true, createdAt: true },
    orderBy: { name: "asc" },
  });
}
