/* eslint-disable @typescript-eslint/no-explicit-any */
import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import createAvalancheClient from "../../util/create-avalanche-client";
import { getContract, getPlayerAddress } from "./helpers";

export const coinFlipPlaceBet = async (index: number) => {
  const client = createAvalancheClient();
  const contract = getContract(client);
  const playerAddress = getPlayerAddress();
  const flipIndex =
    index === -1 || Number.isNaN(index)
      ? (await contract.getCurrentFlipIndex(playerAddress)).toNumber()
      : index;
  const flip = await contract.getFlip(playerAddress, flipIndex);
  console.log({ flipIndex, ...flip });
};

export const register = (): void => {
  program
    .command("coinflip-get-flip")
    .description("Gets a flip")
    .argument("[number]", "The index of the desired flip (defaults to current flip index)", -1)
    .action((index: number) => {
      return wrapAction(coinFlipPlaceBet, parseInt(`${index}`, 10));
    });
};

export default { register };
