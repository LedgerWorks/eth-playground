import { Contract, ethers, Wallet } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

import abi from "./abi";

export const getRequired = (key: string): string => {
  const value = `${process.env[key]}`;
  if (!value) {
    throw new Error(`No ${key} configured on the environment. Add it to your .env file.`);
  }
  return value;
};

export const getOwnerKey = (): string => getRequired("COINFLIP_OWNER_KEY");

export const getContractAddress = (): string => getRequired("COINFLIP_CONTRACT_ADDRESS");

export const getPlayerAddress = (): string => getRequired("COINFLIP_PLAYER_ADDRESS");

export const getPlayerKey = (): string => getRequired("COINFLIP_PLAYER_KEY");

export const getRpcHost = (): string => getRequired("RPC_HOST");

let provider: JsonRpcProvider | undefined;
export const getProvider = (): JsonRpcProvider => {
  if (!provider) {
    provider = new ethers.providers.JsonRpcProvider(`https://${getRpcHost()}/ext/bc/C/rpc`);
  }
  return provider;
};

let ownerWallet: Wallet | undefined;
export const getOwnerWallet = (): Wallet => {
  if (!ownerWallet) {
    ownerWallet = new Wallet(getOwnerKey(), getProvider());
  }
  return ownerWallet;
};

let playerWallet: Wallet | undefined;
export const getPlayerWallet = (): Wallet => {
  if (!playerWallet) {
    playerWallet = new Wallet(getPlayerKey(), getProvider());
  }
  return playerWallet;
};

let contractForOwner: Contract | undefined;
export const getContractForOwner = (): Contract => {
  if (!contractForOwner) {
    contractForOwner = new Contract(getContractAddress(), abi, getOwnerWallet());
  }
  return contractForOwner;
};

let contractForPlayer: Contract | undefined;
export const getContractForPlayer = (): Contract => {
  if (!contractForPlayer) {
    contractForPlayer = new Contract(getContractAddress(), abi, getPlayerWallet());
  }
  return contractForPlayer;
};
