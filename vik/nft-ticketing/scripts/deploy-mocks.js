const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("👷 Deploying mocks with account:", deployer.address);

  const MockV3Aggregator = await hre.ethers.getContractFactory("MockV3Aggregator");

  // 🔢 Price feeds typically have 8 decimals
  const DECIMALS = 8;

  // 🪙 INR/USD = 120 => 120 * 10^8 = 120000000
  const INR_USD_PRICE = 120 * 10 ** DECIMALS;
  const inrUsd = await MockV3Aggregator.deploy(DECIMALS, INR_USD_PRICE);
  await inrUsd.waitForDeployment();
  const inrUsdAddress = await inrUsd.getAddress();
  console.log(`🧪 INR/USD mock deployed at: ${inrUsdAddress} (₹1 = $0.0125)`);

  // 🪙 ETH/USD = 3000 => 3000 * 10^8 = 300000000000
  const ETH_USD_PRICE = 3000 * 10 ** DECIMALS;
  const ethUsd = await MockV3Aggregator.deploy(DECIMALS, ETH_USD_PRICE);
  await ethUsd.waitForDeployment();
  const ethUsdAddress = await ethUsd.getAddress();
  console.log(`🧪 ETH/USD mock deployed at: ${ethUsdAddress} ($1 = 0.00033 ETH)`);

  // ✅ Return addresses if used programmatically
  return {
    inrUsdAddress,
    ethUsdAddress
  };
}

main().catch((error) => {
  console.error("❌ Mock deployment failed:", error);
  process.exitCode = 1;
});
