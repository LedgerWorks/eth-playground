import { program } from "commander";
import { ethers } from "ethers";

import wrapAction from "../util/wrap-action";
import createAvalancheClient from "../util/create-avalanche-client";

type GetBalanceOptions = {
  address: string;
  blockTag?: number;
};

const getBalance = async (address: string, blockTag?: number) => {
  const client = createAvalancheClient();
  const balance = await client.HTTPSProvider.getBalance(address, blockTag);
  const balanceInAvax = ethers.utils.formatUnits(balance, 18);
  console.log(`AVAX balance for ${address}: ${balanceInAvax}`);
};

export const register = (): void => {
  program
    .command("get-avax-balance")
    .argument("address", "The address to get the AVAX balance for")
    .option("--blockTag <string>", "The block number; use this to get point-in-time balances")
    .description(
      "Get the avax balance of a given address. Optionally provide a block number for point-in-time balance lookup"
    )
    .action((address: string, { blockTag }: Partial<GetBalanceOptions>) => {
      return wrapAction(getBalance, address, blockTag);
    });
};
