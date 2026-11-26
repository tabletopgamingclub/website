import { Router } from "express";

import { ROLES } from "../../lib/roles.js";
import { requireAuth } from "../../middlewares/require-auth.js";
import { requireRole } from "../../middlewares/require-role.js";
import { getUsers } from "./admin.controller.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole(ROLES.admin));

adminRouter.get("/users", getUsers);
