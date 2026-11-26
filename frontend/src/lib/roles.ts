export type Role = "ADMIN" | "SOCIO";

const HOME_PATHS: Record<Role, string> = {
  ADMIN: "/admin",
  SOCIO: "/profile",
};

const DEFAULT_HOME_PATH = HOME_PATHS.SOCIO;

export function homePathForRole(role: Role): string {
  return HOME_PATHS[role] ?? DEFAULT_HOME_PATH;
}
