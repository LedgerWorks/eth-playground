/* eslint-disable @typescript-eslint/no-explicit-any */
import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import createAvalancheClient from "../../util/create-avalanche-client";
import { getContract } from "./helpers";

export const coinFlipIsDisabled = async () => {
  const client = createAvalancheClient();
  const contract = getContract(client);
  const isDisabled = await contract.disabled();
  console.log({ isDisabled });
};

export const register = (): void => {
  program
    .command("coinflip-is-disabled")
    .description("Returns whether the game is currently disabled")
    .action(() => {
      return wrapAction(coinFlipIsDisabled);
    });
};

export default { register };
