# NGO Transparency SDK

TypeScript SDK for the NGO Transparency smart contract. Uses **ethers v6** and a **MetaMask** (EIP-1193) provider.

## Install

```bash
cd uwaziSDK/sdk
npm install
npm run build
```

In your frontend app:

```bash
npm install ethers
# link or copy this package, or import from the built dist/
```

## Quick start

```typescript
import { NGOTransparencySDK, NGO_TRANSPARENCY_ABI } from "@uwazi/ngo-transparency-sdk";

const sdk = new NGOTransparencySDK({
  contractAddress: "0xYourDeployedAddress",
  abi: NGO_TRANSPARENCY_ABI,
  provider: window.ethereum,
});

await sdk.connectWallet();
await sdk.donate("0.1");

const donations = await sdk.getDonations();
console.log(donations);
```

## API

| Method | Description |
|--------|-------------|
| `connectWallet()` | Prompts MetaMask; returns connected address |
| `donate(amount)` | `amount` in ETH string (e.g. `"0.05"`) |
| `allocateFunds(beneficiary, amount)` | Admin only |
| `confirmReceipt(allocationId)` | Beneficiary only |
| `getDonations()` | All donations |
| `getAllocations()` | All allocations |
| `getAdmin()` | Deployer / admin address |
| `NGOTransparencySDK.formatAmount(wei)` | Human-readable ETH |

Read methods work without `connectWallet()`; write methods require a connected signer.

## Errors

Failed calls throw `Error` with prefix `NGOTransparencySDK.<method> failed:` and the underlying revert or wallet message.

See `examples/usage.ts` for a full flow.
