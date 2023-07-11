import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import { getContractForOwner, getPlayerAddress } from "./helpers";

export const coinFlipUnban = async () => {
  const contract = getContractForOwner();
  const playerAddress = getPlayerAddress();
  console.log("Sending transaction");
  const tx = await contract.unban(playerAddress);
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("coinflip-unban")
    .description("[admin] Unban the player")
    .action(() => wrapAction(coinFlipUnban));
};

export default { register };
