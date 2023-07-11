/* eslint-disable @typescript-eslint/no-explicit-any */
import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import { getContractForOwner } from "./helpers";

export const coinFlipDisable = async () => {
  const contract = getContractForOwner();
  console.log("Sending transaction");
  const tx = await contract.disable();
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("coinflip-disable")
    .description("[admin] Disable the game")
    .action(() => {
      return wrapAction(coinFlipDisable);
    });
};

export default { register };
