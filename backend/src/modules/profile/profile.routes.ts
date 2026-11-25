import { Router } from "express";

import { requireAuth } from "../../middlewares/require-auth.js";
import { getProfile } from "./profile.controller.js";

export const profileRouter = Router();

profileRouter.get("/", requireAuth, getProfile);
