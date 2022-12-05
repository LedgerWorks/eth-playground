import { ethers } from "ethers";
import { program } from "commander";
import wrapAction from "../util/wrap-action";
import createAvalancheClient, {
  AvalancheClient,
  chainId,
} from "../util/create-avalanche-client";

type SendAvaxOptions = {
  maxFeePerGas?: any;
  maxPriorityFeePerGas?: any;
  nonce?: any;
};

// Function to estimate max fee and max priority fee
const calcFeeData = async (
  client: AvalancheClient,
  maxFeePerGas: number | undefined = undefined,
  maxPriorityFeePerGas: number | undefined = undefined
) => {
  const baseFee = parseInt(await client.cchain.getBaseFee(), 16) / 1e9;
  maxPriorityFeePerGas =
    maxPriorityFeePerGas == undefined
      ? parseInt(await client.cchain.getMaxPriorityFeePerGas(), 16) / 1e9
      : maxPriorityFeePerGas;
  maxFeePerGas =
    maxFeePerGas == undefined ? baseFee + maxPriorityFeePerGas : maxFeePerGas;

  if (maxFeePerGas < maxPriorityFeePerGas) {
    throw "Error: Max fee per gas cannot be less than max priority fee per gas";
  }

  return {
    maxFeePerGas: maxFeePerGas.toString(),
    maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
  };
};

// Function to send AVAX
export const sendAvax = async (amount, to, options: SendAvaxOptions) => {
  const client = createAvalancheClient();
  let { maxFeePerGas, maxPriorityFeePerGas, nonce } = options;

  if (nonce == undefined) {
    nonce = await client.HTTPSProvider.getTransactionCount(
      client.wallet.address
    );
  }
  console.info(`nonce differentiator: ${nonce}`);

  // If the max fee or max priority fee is not provided, then it will automatically calculate using CChain APIs
  ({ maxFeePerGas, maxPriorityFeePerGas } = await calcFeeData(
    client,
    maxFeePerGas,
    maxPriorityFeePerGas
  ));

  maxFeePerGas = ethers.utils.parseUnits(maxFeePerGas, "gwei");
  console.info(`maxFeePerGas: ${maxFeePerGas}`);

  maxPriorityFeePerGas = ethers.utils.parseUnits(maxPriorityFeePerGas, "gwei");
  console.info(`maxPriorityFeePerGas: ${maxPriorityFeePerGas}`);

  // Type 2 transaction is for EIP1559
  const tx: any = {
    type: 2,
    nonce,
    to,
    maxPriorityFeePerGas,
    maxFeePerGas,
    value: ethers.utils.parseEther(amount),
    chainId,
  };

  tx.gasLimit = await client.HTTPSProvider.estimateGas(tx);

  const signedTx = await client.wallet.signTransaction(tx);
  const txHash = ethers.utils.keccak256(signedTx);

  console.log(`Sending signed transaction txHash: ${txHash}`);

  // Sending a signed transaction and waiting for its inclusion
  await (await client.HTTPSProvider.sendTransaction(signedTx)).wait();

  console.log(
    `View transaction with nonce ${nonce} - Fuji Testnet: https://testnet.snowtrace.io/tx/${txHash}`,
    `or Mainnet: https://snowtrace.io//tx/${txHash}`
  );
};

export const register = (): void => {
  program
    .command("send-avax")
    .description("Send AVAX to another address")
    .argument("<number>", "The amount of AVAX to send the receiver address")
    .argument("<string>", "Receiver address to send AVAX")
    .option(
      "--maxFeePerGas <number>",
      "maximum fee per gas you want to pay in nAVAX"
    )
    .option(
      "--maxPriorityFeePerGas <number>",
      "maximum priority fee per gas you want to pay in nAVAX"
    )
    .option(
      "--nonce <number>",
      "differentiator for more than 1 transaction with same signer"
    )
    .action((amount, receiverAddress, options: Partial<SendAvaxOptions>) => {
      return wrapAction(sendAvax, amount, receiverAddress, options);
    });
};

export default { register };
