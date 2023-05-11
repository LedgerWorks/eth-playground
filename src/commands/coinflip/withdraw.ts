/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from "ethers";
import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import createAvalancheClient, { chainId } from "../../util/create-avalanche-client";
import { TransactionOptions, calcFeeData, getContract, getNonce } from "./helpers";

export const coinFlipWithdraw = async (amount: ethers.BigNumber, options: TransactionOptions) => {
  const client = createAvalancheClient();
  const contract = getContract(client);

  const nonce = await getNonce(client, options);
  const { maxFeePerGas, maxPriorityFeePerGas } = await calcFeeData(client, options);

  const tx = await contract.populateTransaction.withdraw(amount);
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
    .command("coinflip-withdraw")
    .description("[admin] Withdraw AVAX from the CoinFlip contract")
    .argument("<amount>", "The amount of AVAX to withdraw")
    .option("--maxFeePerGas <number>", "maximum fee per gas you want to pay in nAVAX")
    .option(
      "--maxPriorityFeePerGas <number>",
      "maximum priority fee per gas you want to pay in nAVAX"
    )
    .option("--nonce <number>", "differentiator for more than 1 transaction with same signer")
    .action((amount: string, options: Partial<TransactionOptions>) => {
      return wrapAction(coinFlipWithdraw, ethers.utils.parseEther(amount), options);
    });
};

export default { register };
