import { BrowserProvider } from "ethers";

/** Chain where 0x84FF… was deployed (Sepolia). Override via .env.local */
export const EXPECTED_CHAIN_ID = BigInt(
  process.env.NEXT_PUBLIC_CHAIN_ID ?? "11155111"
);

export const EXPECTED_CHAIN_NAME =
  process.env.NEXT_PUBLIC_CHAIN_NAME ?? "Sepolia";

export async function assertCorrectNetwork(
  provider: BrowserProvider
): Promise<void> {
  const network = await provider.getNetwork();
  if (network.chainId !== EXPECTED_CHAIN_ID) {
    throw new Error(
      `Wrong network: MetaMask is on chainId ${network.chainId}, but this app expects ` +
        `${EXPECTED_CHAIN_NAME} (${EXPECTED_CHAIN_ID}). ` +
        `Switch MetaMask to ${EXPECTED_CHAIN_NAME} and try again.`
    );
  }
}

export async function assertContractDeployed(
  provider: BrowserProvider,
  contractAddress: string
): Promise<void> {
  const code = await provider.getCode(contractAddress);
  if (code === "0x") {
    const network = await provider.getNetwork();
    throw new Error(
      `No contract at ${contractAddress} on chainId ${network.chainId}. ` +
        `Deploy NGOTransparency on this network, or switch MetaMask to ${EXPECTED_CHAIN_NAME}.`
    );
  }
}