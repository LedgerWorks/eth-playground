import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import { getContractForOwner, getPlayerAddress } from "./helpers";

export const coinFlipGetFlip = async (index: number) => {
  const contract = getContractForOwner();
  const playerAddress = getPlayerAddress();
  const flipIndex =
    index < 0 || Number.isNaN(index)
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
      return wrapAction(coinFlipGetFlip, parseInt(`${index}`, 10));
    });
};

export default { register };
