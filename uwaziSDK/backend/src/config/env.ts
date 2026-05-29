import { config as loadEnv } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backendRoot = resolve(__dirname, "../..");

// Load backend/.env regardless of current working directory.
loadEnv({ path: resolve(backendRoot, ".env") });

function parseOrigins(value: string | undefined): string[] {
  if (!value?.trim()) {
    return ["http://localhost:3000", "http://localhost:3001"];
  }
  return value.split(",").map((o) => o.trim());
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: parseOrigins(process.env.CORS_ORIGIN),
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  useFirebase: Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  ),
};