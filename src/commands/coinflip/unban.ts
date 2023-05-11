/* eslint-disable @typescript-eslint/no-explicit-any */
import { program } from "commander";
import { ethers } from "ethers";
import wrapAction from "../../util/wrap-action";
import createAvalancheClient, { chainId } from "../../util/create-avalanche-client";
import {
  TransactionOptions,
  calcFeeData,
  getContract,
  getNonce,
  getPlayerAddress,
} from "./helpers";

export const coinFlipUnban = async (options: TransactionOptions) => {
  const client = createAvalancheClient();
  const contract = getContract(client);
  const playerAddress = getPlayerAddress();

  const nonce = await getNonce(client, options);
  const { maxFeePerGas, maxPriorityFeePerGas } = await calcFeeData(client, options);

  const tx = await contract.populateTransaction.unbanPlayer(playerAddress);
  tx.type = 2;
  tx.from = client.wallet.address;
  tx.to = contract.address;
  tx.chainId = chainId;
  tx.nonce = nonce;
  tx.maxFeePerGas = maxFeePerGas;
  tx.maxPriorityFeePerGas = maxPriorityFeePerGas;
  tx.gasLimit = await client.provider.estimateGas(tx);

  const signedTx = await client.wallet.signTransaction(tx);
  const txHash = ethers.utils.keccak256(signedTx);

  console.log(`Sending signed transaction txHash: ${txHash}`);
  const submittedTx = await client.provider.sendTransaction(signedTx);
  const receipt = await submittedTx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }

  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("coinflip-unban")
    .description("[admin] Unban the player")
    .option("--maxFeePerGas <number>", "maximum fee per gas you want to pay in nAVAX")
    .option(
      "--maxPriorityFeePerGas <number>",
      "maximum priority fee per gas you want to pay in nAVAX"
    )
    .option("--nonce <number>", "differentiator for more than 1 transaction with same signer")
    .action((options: Partial<TransactionOptions>) => {
      return wrapAction(coinFlipUnban, options);
    });
};

export default { register };
