import { ethers } from "hardhat";

function setupDeployment(name: string, ...constructorArgs: unknown[]) {
  return async () => {
    const contract = await ethers.getContractFactory(name);
    const deployment = await contract.deploy(...constructorArgs);
    await deployment.deployed();
    console.info(
      `Deployed ${name} with constructor args: ${constructorArgs}. Address: ${deployment.address}`
    );
  };
}

const deployments = [
  // setupDeployment("PointlessCurrencyERC20", 5000),
  setupDeployment("TransferFundsViaContract"),
];

async function main() {
  await Promise.all(deployments.map((deployment) => deployment()));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
