/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from "ethers";
import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import createAvalancheClient, { chainId } from "../../util/create-avalanche-client";
import { TransactionOptions, calcFeeData, getContractAddress, getNonce } from "./helpers";

export const coinFlipDeposit = async (amount: ethers.BigNumber, options: TransactionOptions) => {
  const client = createAvalancheClient();
  const contractAddress = getContractAddress();

  const nonce = await getNonce(client, options);
  const { maxFeePerGas, maxPriorityFeePerGas } = await calcFeeData(client, options);

  const tx: any = {
    type: 2,
    to: contractAddress,
    value: amount,
    chainId,
    nonce,
    maxFeePerGas,
    maxPriorityFeePerGas,
  };

  tx.gasLimit = await client.provider.estimateGas(tx);

  const signedTx = await client.wallet.signTransaction(tx);
  const txHash = ethers.utils.keccak256(signedTx);

  console.log(`Sending signed transaction txHash: ${txHash}`);
  await (await client.provider.sendTransaction(signedTx)).wait();

  console.log(
    `View transaction with nonce ${nonce} - Fuji Testnet: https://testnet.snowtrace.io/tx/${txHash}`,
    `or Mainnet: https://snowtrace.io//tx/${txHash}`
  );
};

export const register = (): void => {
  program
    .command("coinflip-deposit")
    .description("[admin] Deposit AVAX into the CoinFlip contract")
    .argument("<number>", "The amount of AVAX to send to the contract")
    .option("--maxFeePerGas <number>", "maximum fee per gas you want to pay in nAVAX")
    .option(
      "--maxPriorityFeePerGas <number>",
      "maximum priority fee per gas you want to pay in nAVAX"
    )
    .option("--nonce <number>", "differentiator for more than 1 transaction with same signer")
    .action((amount: string, options: Partial<TransactionOptions>) => {
      return wrapAction(coinFlipDeposit, ethers.utils.parseEther(amount), options);
    });
};

export default { register };
