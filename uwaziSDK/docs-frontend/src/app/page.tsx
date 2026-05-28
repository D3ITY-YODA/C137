import { CodeBlock } from "@/components/CodeBlock";
import { Section } from "@/components/Section";

const nav = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "installation", label: "Installation" },
  { id: "quickstart", label: "Quick start" },
  { id: "reference", label: "API reference" },
  { id: "examples", label: "Examples" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-400">
              Uwazi SDK
            </p>
            <h1 className="text-xl font-bold text-white">NGO Transparency</h1>
          </div>
          <a
            href="http://localhost:3000"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Open demo
          </a>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-10 px-6">
        <nav className="hidden w-48 shrink-0 py-10 lg:block">
          <ul className="sticky top-24 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-slate-400 hover:text-emerald-400"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1 max-w-3xl pb-20">
          <Section id="overview" title="Overview">
            <p>
              Uwazi NGO Transparency SDK is a hackathon-friendly toolkit for
              integrating blockchain-based donation tracking into any web app.
              Donors send native currency; admins allocate to beneficiaries;
              beneficiaries confirm receipt — all recorded on-chain.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Solidity smart contract (Hardhat)</li>
              <li>TypeScript SDK (ethers.js + MetaMask)</li>
              <li>Optional metadata API (Express + Firebase)</li>
              <li>Demo app to try the full flow</li>
            </ul>
          </Section>

          <Section id="problem" title="Problem it solves">
            <p>
              NGOs struggle to prove how donations are used. Spreadsheets and
              PDF reports are easy to dispute. This SDK anchors donations and
              fund movements on a public ledger while keeping human-readable
              names and purposes in a lightweight backend.
            </p>
            <p>
              <strong className="text-white">On-chain:</strong> amounts, addresses,
              timestamps, allocation and receipt confirmation.
            </p>
            <p>
              <strong className="text-white">Off-chain:</strong> NGO name,
              beneficiary name, and purpose (metadata only — no financial logic).
            </p>
          </Section>

          <Section id="installation" title="Installation">
            <p>Deploy the contract, build the SDK, then install in your app:</p>
            <CodeBlock>{`cd uwaziSDK/contracts
npm install && npm test
npm run deploy:hardhat   # or deploy:local with hardhat node

cd ../sdk
npm install && npm run build

# In your Next.js / React app:
npm install ethers
npm install ../sdk   # or file:../sdk in package.json`}</CodeBlock>
            <p>Optional metadata API:</p>
            <CodeBlock>{`cd uwaziSDK/backend
cp .env.example .env
npm install && npm run dev`}</CodeBlock>
          </Section>

          <Section id="quickstart" title="Quick start">
            <CodeBlock>{`import {
  NGOTransparencySDK,
  NGO_TRANSPARENCY_ABI,
} from "@uwazi/ngo-transparency-sdk";

const sdk = new NGOTransparencySDK({
  contractAddress: "0xYourContract",
  abi: NGO_TRANSPARENCY_ABI,
  provider: window.ethereum,
});

const address = await sdk.connectWallet();
await sdk.donate("0.05");

const donations = await sdk.getDonations();
console.log(donations);`}</CodeBlock>
          </Section>

          <Section id="reference" title="Function reference">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400">
                    <th className="py-2 pr-4">Method</th>
                    <th className="py-2">Description</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-800">
                    <td className="py-2 font-mono text-emerald-300">connectWallet()</td>
                    <td className="py-2">Connect MetaMask; returns address</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-2 font-mono text-emerald-300">donate(amount)</td>
                    <td className="py-2">Send donation (ETH string)</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-2 font-mono text-emerald-300">allocateFunds(beneficiary, amount)</td>
                    <td className="py-2">Admin: transfer from contract balance</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-2 font-mono text-emerald-300">confirmReceipt(allocationId)</td>
                    <td className="py-2">Beneficiary confirms receipt</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-2 font-mono text-emerald-300">getDonations()</td>
                    <td className="py-2">Read all donations</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-2 font-mono text-emerald-300">getAllocations()</td>
                    <td className="py-2">Read all allocations</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-emerald-300">getAdmin()</td>
                    <td className="py-2">Contract admin (deployer) address</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="examples" title="Examples">
            <p className="font-medium text-white">Admin allocation</p>
            <CodeBlock>{`const admin = await sdk.getAdmin();
if (address.toLowerCase() === admin.toLowerCase()) {
  await sdk.allocateFunds(beneficiaryAddress, "0.01");
}`}</CodeBlock>
            <p className="font-medium text-white">Beneficiary confirmation</p>
            <CodeBlock>{`await sdk.confirmReceipt(0);

const allocations = await sdk.getAllocations();
allocations.forEach((a, id) => {
  console.log(id, a.confirmed, NGOTransparencySDK.formatAmount(a.amount));
});`}</CodeBlock>
            <p className="font-medium text-white">Fetch beneficiary metadata (backend)</p>
            <CodeBlock>{`const res = await fetch("http://localhost:4000/api/beneficiaries");
const { data } = await res.json();
// Join with on-chain allocations by wallet address`}</CodeBlock>
          </Section>
        </main>
      </div>
    </div>
  );
}