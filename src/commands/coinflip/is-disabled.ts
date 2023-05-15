import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import { getContractForOwner } from "./helpers";

export const coinFlipIsDisabled = async () => {
  const contract = getContractForOwner();
  const isDisabled = await contract.disabled();
  console.log({ isDisabled });
};

export const register = (): void => {
  program
    .command("coinflip-is-disabled")
    .description("Returns whether the game is currently disabled")
    .action(() => wrapAction(coinFlipIsDisabled));
};

export default { register };
