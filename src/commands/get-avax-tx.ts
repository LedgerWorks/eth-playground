import { program } from "commander";

import wrapAction from "../util/wrap-action";
import createAvalancheClient from "../util/create-avalanche-client";

export const getAvaxTx = async (txHash: string) => {
  const client = createAvalancheClient();

  console.log("Requesting transaction from RPC for txHash: ", txHash);
  const transaction = await client.HTTPSProvider.getTransaction(txHash);

  console.log("transaction response: ", transaction);
};

export const register = (): void => {
  program
    .command("get-avax-tx")
    .description("[NO FEE] Get AVAX transaction")
    .argument("<number>", "The AVAX transactionHash for the target network")
    .action((txHash) => {
      return wrapAction(getAvaxTx, txHash);
    });
};
