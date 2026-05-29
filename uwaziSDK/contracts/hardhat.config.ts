import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

function deployerAccounts(): string[] {
  const key = process.env.DEPLOYER_PRIVATE_KEY?.trim();
  if (!key) return [];
  return [key.startsWith("0x") ? key : `0x${key}`];
}

const accounts = deployerAccounts();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    /** Ethereum testnet — use Sepolia ETH from a faucet */
    sepolia: {
      url:
        process.env.SEPOLIA_RPC_URL ??
        "https://ethereum-sepolia-rpc.publicnode.com",
      accounts,
      chainId: 11155111,
      timeout: 120_000,
    },
    /** Polygon testnet — use Amoy MATIC from a faucet */
    polygonAmoy: {
      url:
        process.env.POLYGON_AMOY_RPC_URL ??
        "https://polygon-amoy-bor-rpc.publicnode.com",
      accounts,
      chainId: 80002,
      timeout: 120_000,
    },
    /** Base (Coinbase L2) testnet */
    baseSepolia: {
      url:
        process.env.BASE_SEPOLIA_RPC_URL ??
        "https://base-sepolia-rpc.publicnode.com",
      accounts,
      chainId: 84532,
      timeout: 120_000,
    },
  },
};

export default config;