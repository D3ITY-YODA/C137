# NGO Transparency — Smart Contract

Minimal Solidity contract for hackathon-style donation tracking and fund allocation.

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
cd uwaziSDK/contracts
npm install
npm run compile
npm test
```

## Deploy

### Local Hardhat network (in-process)

```bash
npm run deploy:hardhat
```

### Local JSON-RPC node (MetaMask / SDK testing)

Terminal 1 — start a local chain:

```bash
npm run node
```

Terminal 2 — deploy:

```bash
npm run deploy:local
```

Copy the printed contract address into your frontend `.env` or SDK config.

### Public testnets (pick one)

The contract works on **any EVM chain** (Ethereum, Polygon, Base, etc.). You only need:

1. `DEPLOYER_PRIVATE_KEY` in `.env` (see `.env.example`)
2. An RPC URL for that chain
3. **Testnet gas tokens** on the deployer address (`0x2c81…` from your logs)

| Network | Deploy command | Faucet | MetaMask chainId |
|---------|----------------|--------|------------------|
| **Ethereum Sepolia** (recommended) | `npm run deploy:sepolia` | [sepoliafaucet.com](https://sepoliafaucet.com) | `11155111` |
| Polygon Amoy | `npm run deploy:amoy` | [Polygon faucet](https://faucet.polygon.technology/) | `80002` |
| Base Sepolia | `npm run deploy:base` | [Coinbase faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet) | `84532` |

**Example — Ethereum Sepolia**

```env
DEPLOYER_PRIVATE_KEY=your_key
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

```bash
npm run balance:sepolia    # must show balance > 0
npm run deploy:sepolia
```

`insufficient funds … balance 0` means the RPC works but the wallet has **no test ETH/MATIC**. Fund `Deploying from:` address on that **same** network.

### RPC errors (443 / ETIMEDOUT)

Use a different RPC in `.env`, or a free [Alchemy](https://www.alchemy.com/) / [Infura](https://www.infura.io/) URL:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
```

```bash
NODE_OPTIONS=--dns-result-order=ipv4first npm run balance:sepolia
```

### Local (no faucet, no real chain)

```bash
npm run node          # terminal 1
npm run deploy:local  # terminal 2 — use in demo with Hardhat MetaMask network
```

## Contract API

| Function | Who | Description |
|----------|-----|-------------|
| `donate()` | Anyone | Payable; sends ETH/MATIC and records donation |
| `allocateFunds(beneficiary, amount)` | Admin (deployer) | Sends funds to beneficiary |
| `confirmReceipt(allocationId)` | Beneficiary | Marks allocation as received |
| `donations(i)` / `allocations(i)` | View | Public array getters |
| `donationsCount()` / `allocationsCount()` | View | Array lengths |

## Events

- `DonationMade(donor, amount, timestamp)`
- `FundsAllocated(beneficiary, amount, allocationId)`
- `ReceiptConfirmed(allocationId, beneficiary)`

After compile, the ABI is at `artifacts/contracts/NGOTransparency.sol/NGOTransparency.json`. The SDK ships a copy in `../sdk/src/abi.ts`.