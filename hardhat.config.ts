import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import dotenv from "dotenv";

dotenv.config();

function getEnvironmentVariable(name: string): string {
  const key = process.env[name];
  if (!key) {
    throw new Error(`The ${name} environment variable must be set`);
  }
  return key as string;
}

function getPrivateKey(): string {
  return getEnvironmentVariable("PRIVATE_KEY");
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.7.6" }, { version: "0.8.17" }, { version: "0.8.20" }],
  },
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
    ethereum: {
      url: "https://rpc.ankr.com/eth",
      chainId: 1,
      accounts: [getPrivateKey()],
    },
  },
  etherscan: {
    apiKey: {
      fuji: getEnvironmentVariable("SNOWTRACE_API_KEY"),
    },
    customChains: [
      {
        network: "fuji",
        chainId: 43113,
        urls: {
          apiURL: "https://api-testnet.snowtrace.io/api",
          browserURL: "https://testnet.snowtrace.io/",
        },
      },
    ],
  },
};

export default config;
