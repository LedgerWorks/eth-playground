import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import { getContractForOwner, getPlayerAddress } from "./helpers";

export const coinFlipBan = async () => {
  const contract = getContractForOwner();
  const playerAddress = getPlayerAddress();
  console.log("Sending transaction");
  const tx = await contract.ban(playerAddress);
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("coinflip-ban")
    .description("[admin] Ban the player")
    .action(() => wrapAction(coinFlipBan));
};

export default { register };
