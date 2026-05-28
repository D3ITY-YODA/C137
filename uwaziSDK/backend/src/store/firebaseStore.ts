import { initializeApp, cert, getApps, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { env } from "../config/env.js";
import type { Beneficiary, CreateBeneficiaryInput, NgoMetadata } from "../types.js";

const NGO_DOC = "metadata/default";
const BENEFICIARIES = "beneficiaries";

let app: App | undefined;
let db: Firestore | undefined;

function getDb(): Firestore {
  if (!db) {
    if (!getApps().length) {
      app = initializeApp({
        credential: cert({
          projectId: env.firebase.projectId!,
          clientEmail: env.firebase.clientEmail!,
          privateKey: env.firebase.privateKey!,
        }),
      });
    }
    db = getFirestore();
  }
  return db!;
}

export const firebaseStore = {
  async getNgo(): Promise<NgoMetadata> {
    const snap = await getDb().doc(NGO_DOC).get();
    if (!snap.exists) {
      return {
        name: "Uwazi Demo NGO",
        description: "Transparent donations powered by on-chain tracking.",
        updatedAt: new Date().toISOString(),
      };
    }
    return snap.data() as NgoMetadata;
  },

  async setNgo(data: { name: string; description: string }): Promise<NgoMetadata> {
    const record: NgoMetadata = {
      name: data.name,
      description: data.description,
      updatedAt: new Date().toISOString(),
    };
    await getDb().doc(NGO_DOC).set(record);
    return record;
  },

  async listBeneficiaries(): Promise<Beneficiary[]> {
    const snap = await getDb().collection(BENEFICIARIES).orderBy("createdAt", "desc").get();
    return snap.docs.map((doc) => doc.data() as Beneficiary);
  },

  async createBeneficiary(input: CreateBeneficiaryInput): Promise<Beneficiary> {
    const id = crypto.randomUUID();
    const record: Beneficiary = {
      id,
      walletAddress: input.walletAddress.toLowerCase(),
      name: input.name,
      purpose: input.purpose,
      createdAt: new Date().toISOString(),
    };
    await getDb().collection(BENEFICIARIES).doc(id).set(record);
    return record;
  },
};
