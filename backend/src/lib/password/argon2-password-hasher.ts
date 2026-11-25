import argon2 from "argon2";

import type { PasswordHasher } from "./password-hasher.js";

const OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
} satisfies argon2.HashOptions;

export const argon2PasswordHasher: PasswordHasher = {
  hash(password) {
    return argon2.hash(password, OPTIONS);
  },

  async verify(hash, password) {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  },
};
