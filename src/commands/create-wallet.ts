import { ethers } from "ethers";
import writeOutJson from "../util/write-out-json";
import { program } from "commander";
import wrapAction from "../util/wrap-action";

const actionName = "create-wallet";

export function createWallet() {
  const wallet = ethers.Wallet.createRandom();

  writeOutJson(actionName, {
    address: wallet.address,
    mnemonic: wallet.mnemonic.phrase,
    privateKey: wallet.privateKey,
  });
}

export const register = (): void => {
  program
    .command(actionName)
    .description("Create a wallet using the ethers library")
    .action(() => {
      return wrapAction(createWallet);
    });
};
