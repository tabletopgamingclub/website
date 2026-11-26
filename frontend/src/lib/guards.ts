import { redirect } from "next/navigation";

import type { AuthenticatedUser } from "./backend";
import { isAdmin } from "./roles";
import { getCurrentUser, getSessionToken } from "./session";

export interface AdminSession {
  token: string;
  user: AuthenticatedUser;
}

export async function requireAdmin(): Promise<AdminSession> {
  const token = await getSessionToken();
  const user = await getCurrentUser();

  if (!token || !user) {
    redirect("/login");
  }

  if (!isAdmin(user)) {
    redirect("/profile");
  }

  return { token, user };
}
