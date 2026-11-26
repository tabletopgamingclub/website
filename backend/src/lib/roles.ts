import { Role } from "../generated/prisma/enums.js";

export const ROLES = {
  admin: Role.ADMIN,
  member: Role.SOCIO,
} as const;

export type UserRole = Role;
