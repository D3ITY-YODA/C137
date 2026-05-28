import { Router } from "express";
import { z } from "zod";
import { store } from "../store/index.js";

const createSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  name: z.string().min(1).max(200),
  purpose: z.string().min(1).max(1000),
});

export const beneficiaryRouter = Router();

beneficiaryRouter.get("/", async (_req, res, next) => {
  try {
    const list = await store.listBeneficiaries();
    res.json({ data: list });
  } catch (error) {
    next(error);
  }
});

beneficiaryRouter.post("/", async (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    const created = await store.createBeneficiary(body);
    res.status(201).json({ data: created });
  } catch (error) {
    next(error);
  }
});
