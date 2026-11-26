import axios from "axios";

import { api } from "./api";
import type { UserRole } from "./roles";

export interface AuthenticatedUser {
  id: string;
  username: string;
  name: string;
  role?: UserRole;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: AuthenticatedUser;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export async function loginRequest(username: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", { username, password });

  return response.data;
}

export async function getProfileRequest(token: string): Promise<AuthenticatedUser> {
  const response = await api.get<AuthenticatedUser>("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
}

export async function getAdminUsersRequest(token: string): Promise<AdminUser[]> {
  const response = await api.get<{ users: AdminUser[] }>("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.users;
}

export function isUnauthorizedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

export function isForbiddenError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 403;
}
