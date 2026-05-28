# NGO Transparency — Backend

Minimal metadata API. **Financial and trust logic stay on-chain**; this service only stores human-readable NGO and beneficiary info.

## Why a backend?

The smart contract stores wallet addresses and amounts only. Apps need names, descriptions, and beneficiary purpose off-chain. The SDK reads chain state; this API enriches the UI.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health + storage mode |
| GET | `/api/ngo` | NGO name & description |
| PUT | `/api/ngo` | Update NGO metadata |
| GET | `/api/beneficiaries` | List beneficiaries |
| POST | `/api/beneficiaries` | Register beneficiary metadata |

### POST `/api/beneficiaries`

```json
{
  "walletAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "name": "Community Clinic",
  "purpose": "Medical supplies for rural clinic"
}
```

## Run

```bash
cd uwaziSDK/backend
cp .env.example .env
npm install
npm run dev
```

Without Firebase env vars, data is stored **in memory** (resets on restart). For persistence, set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` in `.env`.

Default URL: `http://localhost:4000`
