import {
  BrowserProvider,
  Contract,
  formatEther,
  parseEther,
  type InterfaceAbi,
  type Eip1193Provider,
  type Signer,
} from "ethers";
import type { Allocation, Donation, NGOTransparencySDKConfig } from "./types.js";

export class NGOTransparencySDK {
  private readonly contractAddress: string;
  private readonly abi: InterfaceAbi;
  private readonly browserProvider: BrowserProvider;
  private contract: Contract | null = null;
  private signer: Signer | null = null;

  constructor({ contractAddress, abi, provider }: NGOTransparencySDKConfig) {
    if (!contractAddress) {
      throw new Error("contractAddress is required");
    }
    if (!abi?.length) {
      throw new Error("abi is required");
    }
    if (!provider) {
      throw new Error("provider is required (e.g. window.ethereum)");
    }

    this.contractAddress = contractAddress;
    this.abi = abi;
    this.browserProvider = new BrowserProvider(provider as Eip1193Provider);
  }

  /** Request MetaMask (or compatible) accounts and bind the contract to the signer */
  async connectWallet(): Promise<string> {
    try {
      await this.browserProvider.send("eth_requestAccounts", []);
      this.signer = await this.browserProvider.getSigner();
      this.contract = new Contract(
        this.contractAddress,
        this.abi,
        this.signer
      );
      return await this.signer.getAddress();
    } catch (error) {
      throw this.wrapError("connectWallet", error);
    }
  }

  /** Send a donation in ETH (string, e.g. "0.1") */
  async donate(amount: string): Promise<{ hash: string }> {
    const contract = this.requireContract();
    try {
      const value = parseEther(amount);
      console.log(`Donating ${amount} ETH (${value} wei) to ${this.contractAddress}`);
      const tx = await contract.donate({ value });
      const receipt = await tx.wait();
      return { hash: receipt.hash };
    } catch (error) {
      console.error("SDK donate error:", error);
      throw this.wrapError("donate", error);
    }
  }

  /** Admin: allocate native currency to a beneficiary (amount in ETH string) */
  async allocateFunds(
    beneficiary: string,
    amount: string
  ): Promise<{ hash: string; allocationId: number }> {
    const contract = this.requireContract();
    try {
      const countBefore = await contract.allocationsCount();
      const tx = await contract.allocateFunds(
        beneficiary,
        parseEther(amount)
      );
      const receipt = await tx.wait();
      return {
        hash: receipt.hash,
        allocationId: Number(countBefore),
      };
    } catch (error) {
      throw this.wrapError("allocateFunds", error);
    }
  }

  /** Beneficiary: confirm receipt for an allocation */
  async confirmReceipt(allocationId: number): Promise<{ hash: string }> {
    const contract = this.requireContract();
    try {
      const tx = await contract.confirmReceipt(allocationId);
      const receipt = await tx.wait();
      return { hash: receipt.hash };
    } catch (error) {
      throw this.wrapError("confirmReceipt", error);
    }
  }

  /** Read all donations (read-only; wallet not required) */
  async getDonations(): Promise<Donation[]> {
    const contract = this.getReadContract();
    try {
      const count = Number(await contract.donationsCount());
      const donations: Donation[] = [];
      for (let i = 0; i < count; i++) {
        const row = await contract.donations(i);
        donations.push({
          donor: row.donor,
          amount: row.amount,
          timestamp: row.timestamp,
        });
      }
      return donations;
    } catch (error) {
      throw this.wrapError("getDonations", error);
    }
  }

  /** Read all allocations */
  async getAllocations(): Promise<Allocation[]> {
    const contract = this.getReadContract();
    try {
      const count = Number(await contract.allocationsCount());
      const allocations: Allocation[] = [];
      for (let i = 0; i < count; i++) {
        const row = await contract.allocations(i);
        allocations.push({
          beneficiary: row.beneficiary,
          amount: row.amount,
          timestamp: row.timestamp,
          confirmed: row.confirmed,
        });
      }
      return allocations;
    } catch (error) {
      throw this.wrapError("getAllocations", error);
    }
  }

  /** Contract admin address (deployer) */
  async getAdmin(): Promise<string> {
    const contract = this.getReadContract();
    try {
      return await contract.admin();
    } catch (error) {
      throw this.wrapError("getAdmin", error);
    }
  }

  /** Format wei amounts for display */
  static formatAmount(amountWei: bigint): string {
    return formatEther(amountWei);
  }

  private requireContract(): Contract {
    if (!this.contract) {
      throw new Error("Wallet not connected. Call connectWallet() first.");
    }
    return this.contract;
  }

  private getReadContract(): Contract {
    if (this.contract) {
      return this.contract;
    }
    return new Contract(
      this.contractAddress,
      this.abi,
      this.browserProvider
    );
  }

  private wrapError(method: string, error: unknown): Error {
    const message =
      error instanceof Error ? error.message : String(error);
    return new Error(`NGOTransparencySDK.${method} failed: ${message}`);
  }
}
