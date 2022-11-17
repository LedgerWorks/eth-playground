import { ethers } from "ethers";
import { Avalanche } from "avalanche";
import { program } from "commander";
import wrapAction from "../util/wrap-action";
import dotenv from "dotenv";

type Env = {
  NETWORK_STACK: string;
  PRIVATE_KEY: string;
};

type SendAvaxOptions = {
  maxFeePerGas?: any;
  maxPriorityFeePerGas?: any;
  nonce?: any;
};

function loadEnv(): void {
  dotenv.config();

  const missingEnvVars = ["PRIVATE_KEY", "NETWORK_STACK"]
    .filter((s) => !process.env[s])
    .join(", ");

  if (missingEnvVars) {
    throw new Error(
      `No ${missingEnvVars} configured on the environment. Create a .env file. See ./env-example.`
    );
  }
}

loadEnv();

const { PRIVATE_KEY, NETWORK_STACK } = process.env as Env;
const operatorPrivateKey = PRIVATE_KEY;

// For sending a signed transaction to the network
const nodeURL =
  NETWORK_STACK === "mainnet"
    ? "https://api.avax.network/ext/bc/C/rpc"
    : "https://api.avax-test.network/ext/bc/C/rpc";
const HTTPSProvider = new ethers.providers.JsonRpcProvider(nodeURL);

// For estimating max fee and priority fee using CChain APIs
const chainId = 43113;
const avalanche = new Avalanche(
  "api.avax-test.network",
  undefined,
  "https",
  chainId
);
const cchain = avalanche.CChain();

// For signing an unsigned transaction
const wallet = new ethers.Wallet(operatorPrivateKey);
const address = wallet.address;

// Function to estimate max fee and max priority fee
const calcFeeData = async (
  maxFeePerGas: number | undefined = undefined,
  maxPriorityFeePerGas: number | undefined = undefined
) => {
  const baseFee = parseInt(await cchain.getBaseFee(), 16) / 1e9;
  maxPriorityFeePerGas =
    maxPriorityFeePerGas == undefined
      ? parseInt(await cchain.getMaxPriorityFeePerGas(), 16) / 1e9
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
  let { maxFeePerGas, maxPriorityFeePerGas, nonce } = options;

  if (nonce == undefined) {
    nonce = await HTTPSProvider.getTransactionCount(address);
  }
  console.info(`nonce differentiator: ${nonce}`);

  // If the max fee or max priority fee is not provided, then it will automatically calculate using CChain APIs
  ({ maxFeePerGas, maxPriorityFeePerGas } = await calcFeeData(
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

  tx.gasLimit = await HTTPSProvider.estimateGas(tx);

  const signedTx = await wallet.signTransaction(tx);
  const txHash = ethers.utils.keccak256(signedTx);

  console.log(`Sending signed transaction txHash: ${txHash}`);

  // Sending a signed transaction and waiting for its inclusion
  await (await HTTPSProvider.sendTransaction(signedTx)).wait();

  console.log(
    `View transaction with nonce ${nonce}: https://testnet.snowtrace.io/tx/${txHash}`
  );
};

const register = (): void => {
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
