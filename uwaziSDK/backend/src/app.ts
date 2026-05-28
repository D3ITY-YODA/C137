import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { beneficiaryRouter } from "./routes/beneficiaryRoutes.js";
import { ngoRouter } from "./routes/ngoRoutes.js";
import { storageMode } from "./store/index.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
    })
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", storage: storageMode() });
  });

  app.use("/api/ngo", ngoRouter);
  app.use("/api/beneficiaries", beneficiaryRouter);

  app.use(errorHandler);

  return app;
}
