import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

function getPrivateKey(): string {
  const key = process.env.PRIVATE_KEY;
  if (!key) {
    throw new Error("The PRIVATE_KEY environment variable must be set");
  }
  return process.env.PRIVATE_KEY as string;
}

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  paths: {
    sources: "./src/contracts",
    tests: "./src/hardhat-tests",
    cache: "./hardhat-cache",
    artifacts: "./dist/hardhat-artifacts",
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: [getPrivateKey()],
    },
    sepolia: {
      url: "https://rpc.sepolia.org",
      chainId: 11155111,
      accounts: [getPrivateKey()],
    },
  },
};

export default config;
