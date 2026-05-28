const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

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

export async function fetchNgo(): Promise<NgoMetadata> {
  const res = await fetch(`${API_URL}/api/ngo`);
  if (!res.ok) throw new Error("Failed to load NGO metadata");
  const json = await res.json();
  return json.data;
}

export async function fetchBeneficiaries(): Promise<Beneficiary[]> {
  const res = await fetch(`${API_URL}/api/beneficiaries`);
  if (!res.ok) throw new Error("Failed to load beneficiaries");
  const json = await res.json();
  return json.data;
}

export async function createBeneficiary(input: {
  walletAddress: string;
  name: string;
  purpose: string;
}): Promise<Beneficiary> {
  const res = await fetch(`${API_URL}/api/beneficiaries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to create beneficiary");
  }
  const json = await res.json();
  return json.data;
}