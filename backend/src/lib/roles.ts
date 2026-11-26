import { Role } from "../generated/prisma/enums.js";

// Único punto de acceso a los roles desde el código de la aplicación.
// Placeholder hasta que se integre el #2: si ese issue define los roles con otro
// nombre o en otro lugar, solo hay que ajustar este archivo.
export const ROLES = {
  admin: Role.ADMIN,
  member: Role.SOCIO,
} as const;

export type UserRole = Role;
