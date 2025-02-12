/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers, BigNumber } from "ethers";
import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import createAvalancheClient, {
  AvalancheClient,
  chainId,
} from "../../util/create-avalanche-client";
import { getContractAddress } from "./helpers";

type TransactionOptions = {
  nonce: any;
  maxFeePerGas: any;
  maxPriorityFeePerGas: any;
};

const getNonce = async (client: AvalancheClient, options: TransactionOptions): Promise<number> => {
  const nonce = Number.isNaN(parseInt(options.nonce, 10))
    ? await client.provider.getTransactionCount(client.wallet.address)
    : parseInt(options.nonce, 10);
  console.info(`nonce differentiator: ${nonce}`);
  return nonce;
};

const calculateMaxPriorityFeePerGas = async (
  client: AvalancheClient,
  options: TransactionOptions
): Promise<number> => {
  let maxPriorityFeePerGas = parseInt(options.maxPriorityFeePerGas, 10);
  if (Number.isNaN(maxPriorityFeePerGas)) {
    const chainMaxPriorityFeePerGas = await client.cchain.getMaxPriorityFeePerGas();
    const parsedChainMaxPriorityFeePerGas = parseInt(chainMaxPriorityFeePerGas, 16);
    maxPriorityFeePerGas = parsedChainMaxPriorityFeePerGas / 1e9;
  }
  console.info(`maxPriorityFeePerGas: ${maxPriorityFeePerGas}`);
  return maxPriorityFeePerGas;
};

const calculateMaxFeePerGas = async (
  client: AvalancheClient,
  options: TransactionOptions,
  maxPriorityFeePerGas: number
): Promise<number> => {
  let maxFeePerGas = parseInt(options.maxFeePerGas, 10);
  if (Number.isNaN(maxFeePerGas)) {
    const chainBaseFee = await client.cchain.getBaseFee();
    const parsedChainBaseFee = parseInt(chainBaseFee, 16);
    const baseFee = parsedChainBaseFee / 1e9;
    maxFeePerGas = baseFee + maxPriorityFeePerGas;
  }
  console.info(`maxFeePerGas: ${maxFeePerGas}`);
  return maxFeePerGas;
};

const calcFeeData = async (
  client: AvalancheClient,
  options: TransactionOptions
): Promise<{
  maxFeePerGas: ethers.BigNumber;
  maxPriorityFeePerGas: ethers.BigNumber;
}> => {
  const maxPriorityFeePerGas = await calculateMaxPriorityFeePerGas(client, options);
  const maxFeePerGas = await calculateMaxFeePerGas(client, options, maxPriorityFeePerGas);

  if (maxFeePerGas < maxPriorityFeePerGas) {
    throw new Error("Error: Max fee per gas cannot be less than max priority fee per gas");
  }

  return {
    maxFeePerGas: ethers.utils.parseUnits(`${maxFeePerGas}`, "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits(`${maxPriorityFeePerGas}`, "gwei"),
  };
};

export const coinFlipDeposit = async (amount: BigNumber, options: TransactionOptions) => {
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
