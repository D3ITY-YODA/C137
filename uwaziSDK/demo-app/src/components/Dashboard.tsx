"use client";

import { useCallback, useEffect, useState } from "react";
import {
  NGOTransparencySDK,
  type Allocation,
  type Donation,
} from "@uwazi/ngo-transparency-sdk";
import {
  createBeneficiary,
  fetchBeneficiaries,
  fetchNgo,
  type Beneficiary,
  type NgoMetadata,
} from "@/lib/api";
import { assertContractDeployed, assertCorrectNetwork, EXPECTED_CHAIN_NAME } from "@/lib/chain";
import { createSdk, getContractAddress, shortenAddress } from "@/lib/sdk";

export function Dashboard() {
  const [sdk, setSdk] = useState<NGOTransparencySDK | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [admin, setAdmin] = useState<string | null>(null);
  const [ngo, setNgo] = useState<NgoMetadata | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [donateAmount, setDonateAmount] = useState("0.01");
  const [allocateAmount, setAllocateAmount] = useState("0.005");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
  const [confirmId, setConfirmId] = useState("0");
  const [newBenName, setNewBenName] = useState("");
  const [newBenPurpose, setNewBenPurpose] = useState("");
  const [newBenWallet, setNewBenWallet] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshChain = useCallback(async (s: NGOTransparencySDK) => {
    const [d, a, ad] = await Promise.all([
      s.getDonations(),
      s.getAllocations(),
      s.getAdmin(),
    ]);
    setDonations(d);
    setAllocations(a);
    setAdmin(ad);
  }, []);

  const refreshMeta = useCallback(async () => {
    try {
      const [n, b] = await Promise.all([fetchNgo(), fetchBeneficiaries()]);
      setNgo(n);
      setBeneficiaries(b);
      if (b.length && !selectedBeneficiary) {
        setSelectedBeneficiary(b[0].walletAddress);
      }
    } catch {
      setNgo({
        name: "Uwazi Demo NGO",
        description: "Start the backend API to load metadata.",
        updatedAt: new Date().toISOString(),
      });
    }
  }, [selectedBeneficiary]);

  useEffect(() => {
    refreshMeta();
    const s = createSdk();
    setSdk(s);

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          if (s) performConnect(s);
        } else {
          setWallet(null);
          setStatus("Wallet disconnected");
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged as any);
      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged as any);
      };
    }
  }, [refreshMeta]);

  async function connect() {
    setError(null);
    try {
      if (!sdk) {
        const newSdk = createSdk();
        if (!newSdk) throw new Error("MetaMask not detected");
        setSdk(newSdk);
        await performConnect(newSdk);
      } else {
        await performConnect(sdk);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function performConnect(s: NGOTransparencySDK) {
    const address = await s.connectWallet();
    const { BrowserProvider } = await import("ethers");
    const browser = new BrowserProvider(window.ethereum!);
    await assertCorrectNetwork(browser);
    await assertContractDeployed(browser, getContractAddress());
    setWallet(address);
    await refreshChain(s);
    setStatus(`Connected as ${shortenAddress(address)}`);
  }

  async function runAction(
    label: string,
    fn: (s: NGOTransparencySDK) => Promise<unknown>
  ) {
    setError(null);
    setStatus(null);
    setLoading(true);
    try {
      if (!sdk || !wallet) throw new Error("Connect wallet first");
      await fn(sdk);
      await refreshChain(sdk);
      setStatus(label);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  const isAdmin =
    wallet && admin && wallet.toLowerCase() === admin.toLowerCase();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-600">Uwazi Demo</p>
          <h1 className="text-3xl font-bold">{ngo?.name ?? "NGO Transparency"}</h1>
          <p className="mt-1 max-w-xl text-slate-600">{ngo?.description}</p>
          <p className="mt-2 font-mono text-xs text-slate-500">
            Contract: {getContractAddress() || "not set"}
          </p>
          {admin && (
            <p className="mt-1 font-mono text-xs text-slate-500">
              Admin: {admin}
            </p>
          )}
          <p className="text-xs text-slate-500">
            Required network: {EXPECTED_CHAIN_NAME}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {wallet ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800">
              {shortenAddress(wallet)}
              {isAdmin && " · Admin"}
            </span>
          ) : (
            <button
              type="button"
              onClick={connect}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Connect wallet
            </button>
          )}
          <a
            href="http://localhost:3001"
            className="text-sm text-slate-500 hover:text-emerald-600"
          >
            Documentation →
          </a>
        </div>
      </header>

      {(status || error) && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {error ?? status}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Donate">
          <label className="block text-sm text-slate-600">Amount (ETH)</label>
          <input
            type="text"
            value={donateAmount}
            onChange={(e) => setDonateAmount(e.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          />
          <button
            type="button"
            disabled={loading || !wallet}
            onClick={() =>
              runAction("Donation sent", (sdk) => sdk.donate(donateAmount))
            }
            className="mt-3 w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Make donation
          </button>
        </Panel>

        <Panel title="Allocate funds (admin)">
          <label className="block text-sm text-slate-600">Beneficiary</label>
          <select
            value={selectedBeneficiary}
            onChange={(e) => setSelectedBeneficiary(e.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          >
            {beneficiaries.length === 0 && (
              <option value="">No beneficiaries — add below</option>
            )}
            {beneficiaries.map((b) => (
              <option key={b.id} value={b.walletAddress}>
                {b.name} ({shortenAddress(b.walletAddress)})
              </option>
            ))}
          </select>
          <label className="mt-3 block text-sm text-slate-600">Amount (ETH)</label>
          <input
            type="text"
            value={allocateAmount}
            onChange={(e) => setAllocateAmount(e.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          />
          <button
            type="button"
            disabled={loading || !wallet || !isAdmin || !selectedBeneficiary}
            onClick={() =>
              runAction("Funds allocated", (sdk) =>
                sdk.allocateFunds(selectedBeneficiary, allocateAmount)
              )
            }
            className="mt-3 w-full rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Allocate
          </button>
          {!isAdmin && wallet && (
            <p className="mt-2 text-xs text-amber-700">
              Switch to the contract admin wallet to allocate.
            </p>
          )}
        </Panel>

        <Panel title="Confirm receipt (beneficiary)">
          <label className="block text-sm text-slate-600">Allocation ID</label>
          <input
            type="number"
            min={0}
            value={confirmId}
            onChange={(e) => setConfirmId(e.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          />
          <button
            type="button"
            disabled={loading || !wallet}
            onClick={() =>
              runAction("Receipt confirmed", (sdk) =>
                sdk.confirmReceipt(Number(confirmId))
              )
            }
            className="mt-3 w-full rounded-lg bg-slate-700 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Confirm receipt
          </button>
        </Panel>

        <Panel title="Register beneficiary (metadata)">
          <input
            placeholder="Name"
            value={newBenName}
            onChange={(e) => setNewBenName(e.target.value)}
            className="mb-2 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            placeholder="Wallet 0x…"
            value={newBenWallet}
            onChange={(e) => setNewBenWallet(e.target.value)}
            className="mb-2 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            placeholder="Purpose"
            value={newBenPurpose}
            onChange={(e) => setNewBenPurpose(e.target.value)}
            className="mb-2 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              setError(null);
              try {
                await createBeneficiary({
                  name: newBenName,
                  walletAddress: newBenWallet,
                  purpose: newBenPurpose,
                });
                await refreshMeta();
                setStatus("Beneficiary registered (off-chain metadata)");
                setNewBenName("");
                setNewBenWallet("");
                setNewBenPurpose("");
              } catch (e) {
                setError(e instanceof Error ? e.message : String(e));
              } finally {
                setLoading(false);
              }
            }}
            className="w-full rounded-lg border border-slate-300 py-2 text-sm hover:bg-slate-100"
          >
            Add beneficiary
          </button>
        </Panel>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ListPanel title="Donations (on-chain)">
          {donations.length === 0 && (
            <p className="text-sm text-slate-500">No donations yet.</p>
          )}
          <ul className="space-y-2">
            {donations.map((d, i) => (
              <li
                key={i}
                className="rounded border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <span className="font-mono">{shortenAddress(d.donor)}</span>
                <span className="mx-2 text-slate-400">·</span>
                {NGOTransparencySDK.formatAmount(d.amount)} ETH
                <span className="mx-2 text-slate-400">·</span>
                {new Date(Number(d.timestamp) * 1000).toLocaleString()}
              </li>
            ))}
          </ul>
        </ListPanel>

        <ListPanel title="Allocations (on-chain)">
          {allocations.length === 0 && (
            <p className="text-sm text-slate-500">No allocations yet.</p>
          )}
          <ul className="space-y-2">
            {allocations.map((a, i) => {
              const meta = beneficiaries.find(
                (b) =>
                  b.walletAddress.toLowerCase() ===
                  a.beneficiary.toLowerCase()
              );
              return (
                <li
                  key={i}
                  className="rounded border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <span className="font-medium">
                    #{i} {meta?.name ?? shortenAddress(a.beneficiary)}
                  </span>
                  <br />
                  {NGOTransparencySDK.formatAmount(a.amount)} ETH ·{" "}
                  {a.confirmed ? (
                    <span className="text-emerald-600">Confirmed</span>
                  ) : (
                    <span className="text-amber-600">Pending</span>
                  )}
                </li>
              );
            })}
          </ul>
        </ListPanel>
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function ListPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </div>
  );
}