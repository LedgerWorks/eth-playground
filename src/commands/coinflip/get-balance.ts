import { program } from "commander";
import wrapAction from "../../util/wrap-action";
import { getContractForOwner } from "./helpers";
import { ethers } from "ethers";

export const coinFlipGetBalance = async () => {
  const contract = getContractForOwner();
  const balance = await contract.getBalance();
  console.log({ balance: ethers.utils.formatEther(balance) });
};

export const register = (): void => {
  program
    .command("coinflip-get-balance")
    .description("Gets a the contract's balance")
    .action(() => wrapAction(coinFlipGetBalance));
};

export default { register };
