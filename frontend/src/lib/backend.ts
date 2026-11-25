import axios from "axios";

import { api } from "./api";

export interface AuthenticatedUser {
  id: string;
  username: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: AuthenticatedUser;
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

export function isUnauthorizedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
