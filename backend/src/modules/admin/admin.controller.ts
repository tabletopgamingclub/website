import type { RequestHandler } from "express";

import { listUsers } from "./admin.service.js";

export const getUsers: RequestHandler = async (_req, res) => {
  const users = await listUsers();

  res.status(200).json({ users });
};
