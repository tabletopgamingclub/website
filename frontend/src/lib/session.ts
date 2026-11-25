import { cookies } from "next/headers";

import { getProfileRequest, type AuthenticatedUser } from "./backend";

export const SESSION_COOKIE = "tgc_session";

export async function setSession(token: string, expiresIn: number): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: expiresIn,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();

  return cookieStore.get(SESSION_COOKIE)?.value;
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  try {
    return await getProfileRequest(token);
  } catch {
    return null;
  }
}
