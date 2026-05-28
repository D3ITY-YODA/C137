import type { Beneficiary, CreateBeneficiaryInput, NgoMetadata } from "../types.js";

const defaultNgo: NgoMetadata = {
  name: "Uwazi Demo NGO",
  description: "Transparent donations powered by on-chain tracking.",
  updatedAt: new Date().toISOString(),
};

let ngo: NgoMetadata = { ...defaultNgo };
const beneficiaries = new Map<string, Beneficiary>();

export const memoryStore = {
  async getNgo(): Promise<NgoMetadata> {
    return ngo;
  },

  async setNgo(data: { name: string; description: string }): Promise<NgoMetadata> {
    ngo = {
      name: data.name,
      description: data.description,
      updatedAt: new Date().toISOString(),
    };
    return ngo;
  },

  async listBeneficiaries(): Promise<Beneficiary[]> {
    return [...beneficiaries.values()].sort(
      (a, b) => b.createdAt.localeCompare(a.createdAt)
    );
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
    beneficiaries.set(id, record);
    return record;
  },
};
