export interface Donation {
    donor: string;
    amount: bigint;
    timestamp: bigint;
}
export interface Allocation {
    beneficiary: string;
    amount: bigint;
    timestamp: bigint;
    confirmed: boolean;
}
import type { Eip1193Provider, InterfaceAbi } from "ethers";
export interface NGOTransparencySDKConfig {
    contractAddress: string;
    abi: InterfaceAbi;
    provider: Eip1193Provider;
}
//# sourceMappingURL=types.d.ts.map