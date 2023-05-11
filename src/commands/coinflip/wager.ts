/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from "ethers";
import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import createAvalancheClient, { chainId } from "../../util/create-avalanche-client";
import { TransactionOptions, calcFeeData, getContract, getNonce, getPlayerWallet } from "./helpers";

export const coinFlipWager = async (
  calledSide: number,
  amount: ethers.BigNumber,
  options: TransactionOptions
) => {
  ethers.utils.Logger.setLogLevel("DEBUG" as any);
  const client = createAvalancheClient();
  const player = getPlayerWallet(client);
  const contract = getContract(client);
  const nonce = await getNonce(client, options);
  const { maxFeePerGas, maxPriorityFeePerGas } = await calcFeeData(client, options);

  const tx = await contract.populateTransaction.wager(calledSide);
  tx.type = 2;
  tx.from = player.address;
  tx.to = contract.address;
  tx.value = amount;
  tx.chainId = chainId;
  tx.nonce = nonce;
  tx.maxFeePerGas = maxFeePerGas;
  tx.maxPriorityFeePerGas = maxPriorityFeePerGas;
  tx.gasLimit = await client.provider.estimateGas(tx);

  const signedTx = await player.signTransaction(tx);
  const txHash = ethers.utils.keccak256(signedTx);

  console.log(`Sending signed transaction txHash: ${txHash}`);
  const submittedTx = await player.sendTransaction(tx);
  const receipt = await submittedTx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }

  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("coinflip-wager")
    .description("Place a wager on a coin flip")
    .argument("<number>", "The called side (Heads = 1, Tails = 2)")
    .argument("<number>", "The amount of AVAX to wager (must be between 0.01 and 1)")
    .option("--maxFeePerGas <number>", "maximum fee per gas you want to pay in nAVAX")
    .option(
      "--maxPriorityFeePerGas <number>",
      "maximum priority fee per gas you want to pay in nAVAX"
    )
    .option("--nonce <number>", "differentiator for more than 1 transaction with same signer")
    .action((calledSide: number, amount: string, options: Partial<TransactionOptions>) => {
      return wrapAction(coinFlipWager, calledSide, ethers.utils.parseEther(amount), options);
    });
};

export default { register };
