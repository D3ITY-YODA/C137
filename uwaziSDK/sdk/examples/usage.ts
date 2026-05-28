/**
 * Example: using NGOTransparencySDK in a browser app with MetaMask.
 *
 * 1. Deploy the contract (see contracts/README.md)
 * 2. Set CONTRACT_ADDRESS below
 * 3. Run this app behind a bundler, or paste into your React/Vue app
 */

import { NGOTransparencySDK, NGO_TRANSPARENCY_ABI } from "../src/index.js";

declare global {
  interface Window {
    ethereum?: import("ethers").Eip1193Provider;
  }
}

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // replace after deploy

async function main() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const sdk = new NGOTransparencySDK({
    contractAddress: CONTRACT_ADDRESS,
    abi: NGO_TRANSPARENCY_ABI,
    provider: window.ethereum,
  });

  const address = await sdk.connectWallet();
  console.log("Connected:", address);

  // Donor flow
  const donateResult = await sdk.donate("0.01");
  console.log("Donation tx:", donateResult.hash);

  const donations = await sdk.getDonations();
  console.log(
    "Donations:",
    donations.map((d) => ({
      donor: d.donor,
      amount: NGOTransparencySDK.formatAmount(d.amount),
      timestamp: new Date(Number(d.timestamp) * 1000).toISOString(),
    })),
  );

  // Admin flow (must be contract admin / deployer wallet)
  const admin = await sdk.getAdmin();
  if (address.toLowerCase() === admin.toLowerCase()) {
    const beneficiary = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // example
    const alloc = await sdk.allocateFunds(beneficiary, "0.005");
    console.log("Allocation tx:", alloc.hash, "id:", alloc.allocationId);
  }

  const allocations = await sdk.getAllocations();
  console.log(
    "Allocations:",
    allocations.map((a, i) => ({
      id: i,
      beneficiary: a.beneficiary,
      amount: NGOTransparencySDK.formatAmount(a.amount),
      confirmed: a.confirmed,
    })),
  );

  // Beneficiary flow: await sdk.confirmReceipt(0);
}

main().catch(console.error);
