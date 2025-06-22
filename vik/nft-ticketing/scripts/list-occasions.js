const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const tokenMasterAddress = "0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc"; // ✅ Your deployed contract address
  const TokenMaster = await hre.ethers.getContractAt("TokenMaster", tokenMasterAddress);

  const matches = [
    ["Chennai Super Kings VS RCB", 500, 100, "Sun 29 Jun 2025", "7:30 PM", "Chennai"],
    ["Delhi Capitals VS RCB", 450, 120, "Wed 2 Jul 2025", "7:30 PM", "Bangalore"],
    ["CSK VS MI", 600, 90, "Sun 6 Jul 2025", "7:30 PM", "Mumbai"],
    ["RCB VS KKR", 550, 110, "Wed 9 Jul 2025", "7:30 PM", "Kolkata"],
    ["MI VS GT", 480, 95, "Fri 12 Jul 2025", "7:30 PM", "Ahmedabad"],
  ];

  for (let match of matches) {
    const tx = await TokenMaster.list(...match);
    await tx.wait();
    console.log(`✅ Listed occasion: ${match[0]}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
