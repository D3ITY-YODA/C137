export interface NgoMetadata {
  name: string;
  description: string;
  updatedAt: string;
}

export interface Beneficiary {
  id: string;
  walletAddress: string;
  name: string;
  purpose: string;
  createdAt: string;
}

export interface CreateBeneficiaryInput {
  walletAddress: string;
  name: string;
  purpose: string;
}
