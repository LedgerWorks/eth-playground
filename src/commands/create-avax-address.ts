import { ethers } from "ethers";
import { program } from "commander";
import wrapAction from "../util/wrap-action";
import createAvalancheClient from "../util/create-avalanche-client";

export const createAvaxAddress = async () => {
  const client = createAvalancheClient();
  const keypair = client.cchain.keyChain().makeKey();

  const privateKeyString = keypair.getPrivateKeyString(); //returns a CB58 encoded string
  console.log("Private Key: ", privateKeyString);

  const publicKeyBuffer = keypair.getPublicKey(); // returns a CB58 buffer
  const publicKeyString = ethers.utils.computeAddress(publicKeyBuffer);
  console.log("C-Chain Public Key: ", publicKeyString);
};

const register = (): void => {
  program
    .command("create-avax-address")
    .description(
      "create a new address for avalanche returning a public and private key"
    )
    .action(() => {
      return wrapAction(createAvaxAddress);
    });
};

export default { register };
