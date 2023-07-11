import { ethers, Wallet } from "ethers";
import { Avalanche } from "avalanche";
import dotenv from "dotenv";
import { EVMAPI } from "avalanche/dist/apis/evm";
import { JsonRpcProvider } from "@ethersproject/providers";

type Env = {
  RPC_HOST: string;
  PRIVATE_KEY: string;
};

export type AvalancheClient = {
  wallet: Wallet;
  cchain: EVMAPI;
  provider: JsonRpcProvider;
};

export const chainId = 43113;

function loadEnv(): void {
  dotenv.config();

  const missingEnvVars = ["PRIVATE_KEY", "RPC_HOST"].filter((s) => !process.env[s]).join(", ");

  if (missingEnvVars) {
    throw new Error(
      `No ${missingEnvVars} configured on the Avalanche environment. Create a .env file. See ./env-example.`
    );
  }
}

loadEnv();

export default (): AvalancheClient => {
  try {
    const { PRIVATE_KEY, RPC_HOST } = process.env as Env;

    // For sending a signed transaction to the network
    const provider = new ethers.providers.JsonRpcProvider(`https://${RPC_HOST}/ext/bc/C/rpc`);

    // For estimating max fee and priority fee using CChain APIs
    const avalanche = new Avalanche(RPC_HOST, undefined, "https", chainId);
    const cchain = avalanche.CChain();

    // For signing an unsigned transaction
    const wallet = new ethers.Wallet(PRIVATE_KEY);

    return { cchain, wallet, provider };
  } catch (error) {
    console.error("Client creation failed", error);
    throw error;
  }
};
