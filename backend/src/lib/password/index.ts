import type { PasswordHasher } from "./password-hasher.js";
import { argon2PasswordHasher } from "./argon2-password-hasher.js";

const passwordHasher: PasswordHasher = argon2PasswordHasher;

export function hashPassword(password: string): Promise<string> {
  return passwordHasher.hash(password);
}

export function verifyPassword(hash: string, password: string): Promise<boolean> {
  return passwordHasher.verify(hash, password);
}

export type { PasswordHasher } from "./password-hasher.js";
