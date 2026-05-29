import type { Allocation, Donation, NGOTransparencySDKConfig } from "./types.js";
export declare class NGOTransparencySDK {
    private readonly contractAddress;
    private readonly abi;
    private readonly browserProvider;
    private contract;
    private signer;
    constructor({ contractAddress, abi, provider }: NGOTransparencySDKConfig);
    /** Request MetaMask (or compatible) accounts and bind the contract to the signer */
    connectWallet(): Promise<string>;
    /** Send a donation in ETH (string, e.g. "0.1") */
    donate(amount: string): Promise<{
        hash: string;
    }>;
    /** Admin: allocate native currency to a beneficiary (amount in ETH string) */
    allocateFunds(beneficiary: string, amount: string): Promise<{
        hash: string;
        allocationId: number;
    }>;
    /** Beneficiary: confirm receipt for an allocation */
    confirmReceipt(allocationId: number): Promise<{
        hash: string;
    }>;
    /** Read all donations (read-only; wallet not required) */
    getDonations(): Promise<Donation[]>;
    /** Read all allocations */
    getAllocations(): Promise<Allocation[]>;
    /** Contract admin address (deployer) */
    getAdmin(): Promise<string>;
    /** Format wei amounts for display */
    static formatAmount(amountWei: bigint): string;
    private requireContract;
    private getReadContract;
    private wrapError;
}
//# sourceMappingURL=NGOTransparencySDK.d.ts.map