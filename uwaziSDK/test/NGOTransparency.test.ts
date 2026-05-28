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