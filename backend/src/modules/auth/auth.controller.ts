import type { RequestHandler } from "express";

import { login as loginUser } from "./auth.service.js";
import { parseLoginInput } from "./auth.validation.js";

export const login: RequestHandler = async (req, res) => {
  const body: unknown = req.body;
  const input = parseLoginInput(body);
  const result = await loginUser(input);

  res.status(200).json(result);
};
