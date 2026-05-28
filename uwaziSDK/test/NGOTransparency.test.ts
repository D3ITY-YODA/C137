import { expect } from "chai";
import { ethers } from "hardhat";
import { NGOTransparency } from "../typechain-types";

describe("NGOTransparency", () => {
  let contract: NGOTransparency;
  let admin: Awaited<ReturnType<typeof ethers.getSigners>>[0];
  let donor: Awaited<ReturnType<typeof ethers.getSigners>>[1];
  let beneficiary: Awaited<ReturnType<typeof ethers.getSigners>>[2];

  beforeEach(async () => {
    [admin, donor, beneficiary] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("NGOTransparency");
    contract = await factory.connect(admin).deploy();
    await contract.waitForDeployment();
  });

    it("sets deployer as admin", async () => {
    expect(await contract.admin()).to.equal(admin.address);
  });

  it("records donations", async () => {
    const tx = await contract.connect(donor).donate({ value: ethers.parseEther("1") });
    const receipt = await tx.wait();
    const block = await ethers.provider.getBlock(receipt!.blockNumber);

     await expect(tx)
      .to.emit(contract, "DonationMade")
      .withArgs(donor.address, ethers.parseEther("1"), block!.timestamp);

    expect(await contract.donationsCount()).to.equal(1n);
    const donation = await contract.donations(0);
    expect(donation.donor).to.equal(donor.address);
    expect(donation.amount).to.equal(ethers.parseEther("1"));
    expect(donation.timestamp).to.equal(block!.timestamp);
  });

   it("allows admin to allocate and beneficiary to confirm", async () => {
    await contract.connect(donor).donate({ value: ethers.parseEther("2") });

    await expect(
      contract.connect(admin).allocateFunds(beneficiary.address, ethers.parseEther("1"))
    )
      .to.emit(contract, "FundsAllocated")
      .withArgs(beneficiary.address, ethers.parseEther("1"), 0);

    const allocation = await contract.allocations(0);
    expect(allocation.beneficiary).to.equal(beneficiary.address);
    expect(allocation.confirmed).to.equal(false);

    await expect(contract.connect(beneficiary).confirmReceipt(0))
      .to.emit(contract, "ReceiptConfirmed")
      .withArgs(0, beneficiary.address);

    expect((await contract.allocations(0)).confirmed).to.equal(true);
  });
