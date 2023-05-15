import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import { getContractForOwner, getPlayerAddress } from "./helpers";

export const coinFlipIsBanned = async () => {
  const contract = getContractForOwner();
  const playerAddress = getPlayerAddress();
  const isBanned = await contract.isBanned(playerAddress);
  console.log({ isBanned });
};

export const register = (): void => {
  program
    .command("coinflip-is-banned")
    .description("Returns whether the player is currently banned")
    .action(() => wrapAction(coinFlipIsBanned));
};

export default { register };
