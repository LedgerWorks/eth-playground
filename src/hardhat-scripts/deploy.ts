import { ethers, network } from "hardhat";

type DeploymentResult = {
  name: string;
  address: string;
};

type DeploymentBuilder = {
  name: string;
  constructorArgBuilder: (previousDeployments: Record<string, DeploymentResult>) => unknown[];
};

/**
 * Given a map of previous deployments and a deployment builder, run the deployment using the
 * deployment builder. This pattern allows constructing "dependent deployments" that may need
 * the address of previous ones (e.g. delgating contracts with constructor injection)
 * @param previousDeployments Previously completed deployments that can be looked up by contract name
 * @param deploymentBuilder A deployment builder for the current deployment
 * @returns The deployment result for the current deployment
 */
async function deploy(
  previousDeployments: Record<string, DeploymentResult>,
  deploymentBuilder: DeploymentBuilder
): Promise<DeploymentResult> {
  const contract = await ethers.getContractFactory(deploymentBuilder.name);
  const constructorArgs = deploymentBuilder.constructorArgBuilder(previousDeployments);
  const deployment = await contract.deploy(...constructorArgs);
  await deployment.waitForDeployment();
  const argsString = constructorArgs.length ? `Constructor args: ${constructorArgs}, ` : "";
  const deploymentAddress = await deployment.getAddress();
  console.info(
    `Deployed ${deploymentBuilder.name} to the ${network.name} network. ${argsString}Address: ${deploymentAddress}`
  );
  return { name: deploymentBuilder.name, address: deploymentAddress };
}

function independentDeployment(name: string, ...constructorArgs: unknown[]): DeploymentBuilder {
  return {
    name,
    constructorArgBuilder: () => constructorArgs,
  };
}

const deployments: DeploymentBuilder[] = [
  // independentDeployment("TransferFundsViaContract"),
  // independentDeployment("PointlessCurrencyERC20", 1000000),
  // {
  //   name: "TransferDelegate",
  //   constructorArgBuilder: (previousDeployments) => [
  //     2000000,
  //     previousDeployments.PointlessCurrencyERC20.address,
  //   ],
  // },
  // independentDeployment("RWATransfer", 1000000),
  // independentDeployment("SubclassedERC20", "CoryBucks", "CRYBKS", 5000),
  // independentDeployment("SubclassedERC20", "Chubbleduckets", "CHBLZ", 5000),
  // independentDeployment("Swap"),
  // independentDeployment("SecurityMistakesERC20", 1000000),
  // independentDeployment("SecurityExploiter"),
  // independentDeployment("TinyContract"),
  // independentDeployment("V1Subcontract"),
  // independentDeployment("V2Subcontract"),
  // {
  //   name: "UpdatableContract",
  //   constructorArgBuilder: (previousDeployments) => [previousDeployments.V1Subcontract.address],
  // },
  // independentDeployment("TypesPlinking"),
  // tuple parameter can be passed as an object which represents the solidity struct
  // independentDeployment(
  //   "TupleContract",
  //   {
  //     name: "CostalotofmoneyCo",
  //     availableCash: 5000,
  //   },
  //   [{ name: "Jelly", quantity: 50 }]
  // ),
  // tuple parameter can be passed the way remix.ethereum.org accepts the struct
  // independentDeployment(
  //   "TupleContract",
  //   ["schnuckies", 10000],
  //   [{ name: "Peanut Butter", quantity: 1000 }]
  // ),
  // independentDeployment("CoinFlip"),
  independentDeployment("HelloWorldV1"),
  {
    name: "HelloWorldProxy",
    constructorArgBuilder: (previousDeployments) => [previousDeployments.HelloWorldV1.address],
  },
  // independentDeployment("DemoContract", "Ledger Works Demo Contract", "LWORKS", "1"),
];

async function main() {
  await deployments.reduce(async (pendingDeployments, deploymentBuilder) => {
    const previousDeployments = await pendingDeployments;
    const deploymentResult = await deploy(previousDeployments, deploymentBuilder);
    return { ...previousDeployments, [deploymentBuilder.name]: deploymentResult };
  }, Promise.resolve({} as Record<string, DeploymentResult>));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
