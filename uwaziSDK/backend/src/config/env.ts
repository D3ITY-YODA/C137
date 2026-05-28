import "dotenv/config";

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
