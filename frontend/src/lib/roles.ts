export type UserRole = "ADMIN" | "SOCIO";

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador/a",
  SOCIO: "Socio/a",
};

export function isAdmin(user: { role?: UserRole }): boolean {
  return user.role === "ADMIN";
}
