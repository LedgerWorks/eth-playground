import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import { getContractForPlayer } from "./helpers";

export const coinFlipCollect = async () => {
  const contract = getContractForPlayer();
  console.log("Sending transaction");
  const tx = await contract.collect();
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("coinflip-collect")
    .description("Collect the payout from a successful coin flip.")
    .action(() => wrapAction(coinFlipCollect));
};

export default { register };
