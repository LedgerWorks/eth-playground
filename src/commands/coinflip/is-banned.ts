/* eslint-disable @typescript-eslint/no-explicit-any */
import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import createAvalancheClient from "../../util/create-avalanche-client";
import { getContract, getPlayerAddress } from "./helpers";

export const coinFlipIsBanned = async () => {
  const client = createAvalancheClient();
  const contract = getContract(client);
  const playerAddress = getPlayerAddress();
  const isBanned = await contract.isBanned(playerAddress);
  console.log({ isBanned });
};

export const register = (): void => {
  program
    .command("coinflip-is-banned")
    .description("Returns whether the player is currently banned")
    .action(() => {
      return wrapAction(coinFlipIsBanned);
    });
};

export default { register };
