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

### Polygon Amoy testnet

1. Create `.env` in this folder:

```env
DEPLOYER_PRIVATE_KEY=your_wallet_private_key_without_0x_prefix
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
```

2. Fund the deployer wallet with Amoy MATIC from a faucet.
3. Deploy:

```bash
npx hardhat run scripts/deploy.ts --network polygonAmoy
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
