/* eslint-disable @typescript-eslint/no-explicit-any */
import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import createAvalancheClient from "../../util/create-avalanche-client";
import { getContract, getPlayerAddress } from "./helpers";

export const coinFlipIsWinner = async () => {
  const client = createAvalancheClient();
  const contract = getContract(client);
  const playerAddress = getPlayerAddress();
  const isWinner = await contract.isWinner(playerAddress);
  console.log({ isWinner });
};

export const register = (): void => {
  program
    .command("coinflip-is-winner")
    .description("Returns whether the player is currently a winner")
    .action(() => {
      return wrapAction(coinFlipIsWinner);
    });
};

export default { register };
