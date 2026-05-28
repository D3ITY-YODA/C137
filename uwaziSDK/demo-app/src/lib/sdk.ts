import {
  NGOTransparencySDK,
  NGO_TRANSPARENCY_ABI,
} from "@uwazi/ngo-transparency-sdk";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";

export function getContractAddress(): string {
  return CONTRACT_ADDRESS;
}

export function createSdk(): NGOTransparencySDK | null {
  if (typeof window === "undefined" || !window.ethereum) {
    return null;
  }
  if (!CONTRACT_ADDRESS) {
    throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is not set");
  }
  return new NGOTransparencySDK({
    contractAddress: CONTRACT_ADDRESS,
    abi: NGO_TRANSPARENCY_ABI,
    provider: window.ethereum,
  });
}

export function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}