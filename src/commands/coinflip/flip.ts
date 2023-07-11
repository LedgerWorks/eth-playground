import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import { getContractForPlayer } from "./helpers";

export const coinFlipFlip = async (timestamp: number) => {
  const contract = getContractForPlayer();
  console.log("Sending transaction");
  const tx = await contract.flip(timestamp);
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("coinflip-flip")
    .description("Initiate a coin flip")
    .argument("<number>", "The current timestamp")
    .action((timestamp: number) => {
      return wrapAction(coinFlipFlip, timestamp);
    });
};

export default { register };
