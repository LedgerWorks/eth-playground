/* eslint-disable @typescript-eslint/no-explicit-any */
import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import createAvalancheClient from "../../util/create-avalanche-client";
import { getContract } from "./helpers";
import { ethers } from "ethers";

export const coinFlipPlaceBet = async () => {
  const client = createAvalancheClient();
  const contract = getContract(client);
  const balance = await contract.getBalance();
  console.log({ balance: ethers.utils.formatEther(balance) });
};

export const register = (): void => {
  program
    .command("coinflip-get-balance")
    .description("Gets a the contract's balance")
    .action(() => {
      return wrapAction(coinFlipPlaceBet);
    });
};

export default { register };
