/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from "ethers";

import { AvalancheClient } from "../../util/create-avalanche-client";
import abi from "./abi";

export const getContractAddress = (): string => {
  const contractAddress = `${process.env.COINFLIP_CONTRACT_ADDRESS}`;
  if (!contractAddress) {
    throw new Error(
      "No COINFLIP_CONTRACT_ADDRESS configured on the environment. Add it to your .env file."
    );
  }
  return contractAddress;
};

export const getPlayerAddress = (): string => {
  const playerAddress = `${process.env.COINFLIP_PLAYER_ADDRESS}`;
  if (!playerAddress) {
    throw new Error(
      "No COINFLIP_PLAYER_ADDRESS configured on the environment. Add it to your .env file."
    );
  }
  return playerAddress;
};

export const getPlayerKey = (): string => {
  const playerKey = `${process.env.COINFLIP_PLAYER_KEY}`;
  if (!playerKey) {
    throw new Error(
      "No COINFLIP_PLAYER_KEY configured on the environment. Add it to your .env file."
    );
  }
  return playerKey;
};

export type TransactionOptions = {
  nonce: any;
  maxFeePerGas: any;
  maxPriorityFeePerGas: any;
};

export const getNonce = async (
  client: AvalancheClient,
  options: TransactionOptions
): Promise<number> => {
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

export const calcFeeData = async (
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

export const getContract = (client: AvalancheClient): ethers.Contract => {
  return new ethers.Contract(getContractAddress(), abi, client.provider);
};

export const getPlayerWallet = (client: AvalancheClient): ethers.Wallet => {
  return new ethers.Wallet(getPlayerKey(), client.provider);
};
