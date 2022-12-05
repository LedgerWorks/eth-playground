import { ethers } from "hardhat";

function setupDeployment(name: string, ...constructorArgs: unknown[]): () => Promise<void> {
  return async () => {
    const contract = await ethers.getContractFactory(name);
    const deployment = await contract.deploy(...constructorArgs);
    await deployment.deployed();
    const argsString = constructorArgs.length ? `Constructor args: ${constructorArgs}, ` : "";
    console.info(`Deployed ${name}. ${argsString}Address: ${deployment.address}`);
  };
}

const deployments = [
  setupDeployment("PointlessCurrencyERC20", 5000),
  setupDeployment("TransferFundsViaContract"),
];

async function main() {
  await deployments.reduce(async (previousDeployment, deployment) => {
    await previousDeployment;
    return deployment();
  }, Promise.resolve());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
