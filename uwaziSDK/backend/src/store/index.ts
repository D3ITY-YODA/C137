import { env } from "../config/env.js";
import { firebaseStore } from "./firebaseStore.js";
import { memoryStore } from "./memoryStore.js";

export const store = env.useFirebase ? firebaseStore : memoryStore;

export function storageMode(): "firebase" | "memory" {
  return env.useFirebase ? "firebase" : "memory";
}
