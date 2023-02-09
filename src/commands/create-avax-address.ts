import { ethers } from "ethers";
import { program } from "commander";
import wrapAction from "../util/wrap-action";
import createAvalancheClient from "../util/create-avalanche-client";

export const createAvaxAddress = async () => {
  const client = createAvalancheClient();
  const keypair = client.cchain.keyChain().makeKey();

  const privateKeyString = keypair.getPrivateKey();
  console.log("Private Key (C-Chain): ", privateKeyString.toString("hex"));

  const publicKeyBuffer = keypair.getPublicKey();
  const publicKeyString = ethers.utils.computeAddress(publicKeyBuffer);
  console.log("Public Key (C-Chain): ", publicKeyString);
};

export const register = (): void => {
  program
    .command("create-avax-address")
    .description("create a new address for avalanche returning a public and private key")
    .action(() => {
      return wrapAction(createAvaxAddress);
    });
};
