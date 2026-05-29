import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const NGOTransparency = await ethers.getContractFactory("NGOTransparency");
  const contract = await NGOTransparency.deploy();

  await contract.waitForDeployment();

  console.log("NGOTransparency deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
