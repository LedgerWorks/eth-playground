import { ethers, BigNumber } from "ethers";
import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import { getContractForOwner } from "./helpers";

export const coinFlipWithdraw = async (amount: BigNumber) => {
  const contract = getContractForOwner();
  console.log("Sending transaction");
  const tx = await contract.withdraw(amount);
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("coinflip-withdraw")
    .description("[admin] Withdraw AVAX from the CoinFlip contract")
    .argument("<amount>", "The amount of AVAX to withdraw")
    .action((amount: string) => wrapAction(coinFlipWithdraw, ethers.utils.parseEther(amount)));
};

export default { register };
