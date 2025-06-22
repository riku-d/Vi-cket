const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 Deploying TokenMaster with account:", deployer.address);

  // Replace with actual deployed mock addresses if using mocks
  const inrUsdAddress = "0xc351628EB244ec633d5f21fBD6621e1a683B1181";
  const ethUsdAddress = "0xFD471836031dc5108809D173A067e8486B9047A3";


  const TokenMaster = await hre.ethers.getContractFactory("TokenMaster");
  const tokenMaster = await TokenMaster.deploy(
    inrUsdAddress,
    ethUsdAddress,
    "TokenMaster",
    "TM"
  );

  await tokenMaster.waitForDeployment();
  const contractAddress = await tokenMaster.getAddress();

  console.log("🎫 TokenMaster deployed at:", contractAddress);

  // Optionally write to file for reuse
  const fs = require("fs");
  fs.writeFileSync("deployed-contract.json", JSON.stringify({ tokenMaster: contractAddress }, null, 2));
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
