# NGO Transparency SDK

Monorepo for the NGO Transparency project. This repository contains the smart contracts, a TypeScript SDK, a backend service, a demo Next.js app and documentation frontend.

Contents
- `uwaziSDK/contracts` — Hardhat smart contract project for the NGOTransparency contract.
- `uwaziSDK/sdk` — TypeScript SDK that wraps contract interactions for use in apps.
- `uwaziSDK/backend` — Express + TypeScript backend (uses Firebase and provides HTTP APIs).
- `uwaziSDK/demo-app` — Next.js demo application illustrating SDK usage (port 3000).
- `uwaziSDK/docs-frontend` — Next.js documentation site (port 3001).

Prerequisites
- Node.js >= 18
- npm (or pnpm/yarn) — commands below use `npm`
- Git
- For contracts: Hardhat (installed as a devDependency in `uwaziSDK/contracts`)
- Optional: a local Ethereum node (Hardhat node) or access to a testnet/RPC for deployments
- For backend: Firebase service account credentials or other environment variables as required by the backend service

Quick setup
1. From the repository root, install dependencies per package (recommended):

```bash
for d in uwaziSDK/*; do
	if [ -f "$d/package.json" ]; then
		(cd "$d" && npm install)
	fi
done
```

Or install individually:

```bash
cd uwaziSDK/backend && npm install
cd ../contracts && npm install
cd ../sdk && npm install
cd ../demo-app && npm install
cd ../docs-frontend && npm install
```

Build the SDK (optional, required by production builds):

```bash
cd uwaziSDK/sdk
npm run build
```

Contracts
- Compile:

```bash
cd uwaziSDK/contracts
npm run compile
```

- Run a local Hardhat node (useful for deploying and testing locally):

```bash
cd uwaziSDK/contracts
npm run node
```

- Deploy to local Hardhat network (requires `hardhat node` running):

```bash
cd uwaziSDK/contracts
npm run deploy:local
```

- Run contract tests:

```bash
cd uwaziSDK/contracts
npm run test
```

SDK
- The TypeScript SDK lives in `uwaziSDK/sdk`.
- Build the SDK:

```bash
cd uwaziSDK/sdk
npm run build
```

- Run the example usage script (uses `tsx`):

```bash
cd uwaziSDK/sdk
npm run example
```

Backend
- The backend is an Express + TypeScript service in `uwaziSDK/backend`.
- Development server (hot reload with `tsx`):

```bash
cd uwaziSDK/backend
npm run dev
```

- Build and run production:

```bash
cd uwaziSDK/backend
npm run build
npm start
```

- Environment: The backend depends on Firebase Admin and other env vars. Provide credentials using a service account JSON and/or environment variables (for example `GOOGLE_APPLICATION_CREDENTIALS` pointing to the service account file). Check `uwaziSDK/backend/src/config` for expected variables.

Demo app
- The demo Next.js application is in `uwaziSDK/demo-app` and runs on port 3000 by default.

```bash
cd uwaziSDK/demo-app
npm run dev
```

Docs frontend
- The documentation site is in `uwaziSDK/docs-frontend` and runs on port 3001 by default.

```bash
cd uwaziSDK/docs-frontend
npm run dev
```

Notes & tips
- Ports: demo app uses port 3000, docs frontend uses port 3001, backend default port depends on its configuration. Adjust as necessary.
- Environment variables: check each package for `.env` usage. The `uwaziSDK/backend` and `uwaziSDK/contracts` directories commonly rely on environment variables (Firebase keys, RPC URLs, private keys) — add a `.env` or set the variables in your shell before running deploy scripts.
- Monorepo workflows: the SDK is linked locally via the demo app's `package.json` (file:../sdk). If you change the SDK, rebuild it (`npm run build` in `uwaziSDK/sdk`) so the demo app picks up the compiled output.

Troubleshooting
- If you hit dependency conflicts, try removing `node_modules` and re-running the install in the failing package.
- If deployments fail, confirm your RPC configuration and private keys in `uwaziSDK/contracts/.env` or your network configuration.

Contributing
- Add tests to `uwaziSDK/contracts` and keep contract ABI/addresses synchronized with the SDK when contracts change.
- Prefer small, focused pull requests that update the relevant package only.

Where to look next
- Backend source: uwaziSDK/backend/src
- Contracts: uwaziSDK/contracts/contracts
- SDK: uwaziSDK/sdk/src
- Demo app: uwaziSDK/demo-app/src
- Docs frontend: uwaziSDK/docs-frontend/src

If you'd like, I can:
- add per-package README files with more detailed env examples
- create a root-level script to bootstrap and run all dev servers concurrently

---
Updated README for the repo.
