/* eslint-disable @typescript-eslint/no-explicit-any */
import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import { getContractForOwner } from "./helpers";

export const coinFlipEnable = async () => {
  const contract = getContractForOwner();
  console.log("Sending transaction");
  const tx = await contract.enable();
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("coinflip-enable")
    .description("[admin] Enable the game")
    .action(() => {
      return wrapAction(coinFlipEnable);
    });
};

export default { register };
