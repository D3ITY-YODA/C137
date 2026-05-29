import { BrowserProvider, Contract, formatEther, parseEther, } from "ethers";
export class NGOTransparencySDK {
    contractAddress;
    abi;
    browserProvider;
    contract = null;
    signer = null;
    constructor({ contractAddress, abi, provider }) {
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
        this.browserProvider = new BrowserProvider(provider);
    }
    /** Request MetaMask (or compatible) accounts and bind the contract to the signer */
    async connectWallet() {
        try {
            await this.browserProvider.send("eth_requestAccounts", []);
            this.signer = await this.browserProvider.getSigner();
            this.contract = new Contract(this.contractAddress, this.abi, this.signer);
            return await this.signer.getAddress();
        }
        catch (error) {
            throw this.wrapError("connectWallet", error);
        }
    }
    /** Send a donation in ETH (string, e.g. "0.1") */
    async donate(amount) {
        const contract = this.requireContract();
        try {
            const value = parseEther(amount);
            console.log(`Donating ${amount} ETH (${value} wei) to ${this.contractAddress}`);
            const tx = await contract.donate({ value });
            const receipt = await tx.wait();
            return { hash: receipt.hash };
        }
        catch (error) {
            console.error("SDK donate error:", error);
            throw this.wrapError("donate", error);
        }
    }
    /** Admin: allocate native currency to a beneficiary (amount in ETH string) */
    async allocateFunds(beneficiary, amount) {
        const contract = this.requireContract();
        try {
            const countBefore = await contract.allocationsCount();
            const tx = await contract.allocateFunds(beneficiary, parseEther(amount));
            const receipt = await tx.wait();
            return {
                hash: receipt.hash,
                allocationId: Number(countBefore),
            };
        }
        catch (error) {
            throw this.wrapError("allocateFunds", error);
        }
    }
    /** Beneficiary: confirm receipt for an allocation */
    async confirmReceipt(allocationId) {
        const contract = this.requireContract();
        try {
            const tx = await contract.confirmReceipt(allocationId);
            const receipt = await tx.wait();
            return { hash: receipt.hash };
        }
        catch (error) {
            throw this.wrapError("confirmReceipt", error);
        }
    }
    /** Read all donations (read-only; wallet not required) */
    async getDonations() {
        const contract = this.getReadContract();
        try {
            const count = Number(await contract.donationsCount());
            const donations = [];
            for (let i = 0; i < count; i++) {
                const row = await contract.donations(i);
                donations.push({
                    donor: row.donor,
                    amount: row.amount,
                    timestamp: row.timestamp,
                });
            }
            return donations;
        }
        catch (error) {
            throw this.wrapError("getDonations", error);
        }
    }
    /** Read all allocations */
    async getAllocations() {
        const contract = this.getReadContract();
        try {
            const count = Number(await contract.allocationsCount());
            const allocations = [];
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
        }
        catch (error) {
            throw this.wrapError("getAllocations", error);
        }
    }
    /** Contract admin address (deployer) */
    async getAdmin() {
        const contract = this.getReadContract();
        try {
            return await contract.admin();
        }
        catch (error) {
            throw this.wrapError("getAdmin", error);
        }
    }
    /** Format wei amounts for display */
    static formatAmount(amountWei) {
        return formatEther(amountWei);
    }
    requireContract() {
        if (!this.contract) {
            throw new Error("Wallet not connected. Call connectWallet() first.");
        }
        return this.contract;
    }
    getReadContract() {
        if (this.contract) {
            return this.contract;
        }
        return new Contract(this.contractAddress, this.abi, this.browserProvider);
    }
    wrapError(method, error) {
        const message = error instanceof Error ? error.message : String(error);
        return new Error(`NGOTransparencySDK.${method} failed: ${message}`);
    }
}
