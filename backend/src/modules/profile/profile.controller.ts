import type { RequestHandler } from "express";

import { AppError } from "../../errors/app-error.js";
import { getProfile as getUserProfile } from "./profile.service.js";

export const getProfile: RequestHandler = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(401, "UNAUTHORIZED", "Se requiere autenticación.");
  }

  const profile = await getUserProfile(userId);

  res.status(200).json(profile);
};
