import { ethers, Wallet } from "ethers";
import { Avalanche } from "avalanche";
import dotenv from "dotenv";
import { EVMAPI } from "avalanche/dist/apis/evm";
import { JsonRpcProvider } from "@ethersproject/providers";

type Env = {
  NETWORK_STACK: string;
  PRIVATE_KEY: string;
};

type Client = {
  wallet: Wallet;
  address: string;
  cchainApi: EVMAPI;
  rpcProvider: JsonRpcProvider;
};

function loadEnv(): void {
  dotenv.config();

  const missingEnvVars = ["PRIVATE_KEY"]
    .filter((s) => !process.env[s])
    .join(", ");

  if (missingEnvVars) {
    throw new Error(
      `No ${missingEnvVars} configured on the environment. Create a .env file. See ./env-example.`
    );
  }
}

loadEnv();

export default (): Client => {
  try {
    const { PRIVATE_KEY, NETWORK_STACK } = process.env as Env;

    // For sending a signed transaction to the network
    const nodeURL = NETWORK_STACK;
    const HTTPSProvider = new ethers.providers.JsonRpcProvider(nodeURL);

    // For estimating max fee and priority fee using CChain APIs
    const chainId = 43113;
    const avalanche = new Avalanche(
      "api.avax-test.network",
      undefined,
      "https",
      chainId
    );
    const cchainApi = avalanche.CChain();

    // For signing an unsigned transaction
    const wallet = new ethers.Wallet(PRIVATE_KEY);
    const address = wallet.address;
    return { cchainApi, wallet, address, rpcProvider: HTTPSProvider };
  } catch (error) {
    console.error("Client creation failed", error);
    throw error;
  }
};
