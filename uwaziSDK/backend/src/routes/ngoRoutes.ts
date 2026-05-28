import { Router } from "express";
import { z } from "zod";
import { store } from "../store/index.js";

const updateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
});

export const ngoRouter = Router();

ngoRouter.get("/", async (_req, res, next) => {
  try {
    const ngo = await store.getNgo();
    res.json({ data: ngo });
  } catch (error) {
    next(error);
  }
});

ngoRouter.put("/", async (req, res, next) => {
  try {
    const body = updateSchema.parse(req.body);
    const ngo = await store.setNgo(body);
    res.json({ data: ngo });
  } catch (error) {
    next(error);
  }
});
