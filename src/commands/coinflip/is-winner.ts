import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import { getContractForOwner, getPlayerAddress } from "./helpers";

export const coinFlipIsWinner = async () => {
  const contract = getContractForOwner();
  const playerAddress = getPlayerAddress();
  const isWinner = await contract.isWinner(playerAddress);
  console.log({ isWinner });
};

export const register = (): void => {
  program
    .command("coinflip-is-winner")
    .description("Returns whether the player is currently a winner")
    .action(() => wrapAction(coinFlipIsWinner));
};

export default { register };
