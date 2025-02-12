# Eth Playground

Provides an (incomplete) CLI interface for ethereum (eth) provider chains

## Setup

Create a .env file at the root. See [.env-example](.env-example).

## Testing Contracts Locally

We use Hardhat to run test smart contracts. In order to run these tests,
take the following steps:

1. Ensure you have all dependencies installed: `npm install`
2. Run all tests: `npm test`

## Using the Play Script

```shell
npm install
npm run play -- help
```

### Examples

#### Get a List of Available Subcommands

```
npm run play -- --help
```

#### Get Help for a Subcommand

```
npm run play <subcommand> -- --help
```

### Avalanche Examples

Example commands for interacting with eth on Avalanche C-Chain.

#### Send AVAX to another address

```
npm run play send-avax 0.01 "0x496678ceb28597228e1edaf73950e7b0d8d7343a"

 OR use optional values

npm run play send-avax 0.01 "0x496678ceb28597228e1edaf73950e7b0d8d7343a" --maxFeePerGas=250000000 --maxPriorityFeePerGas=0 --nonce=7
```

Upon success, that command will output the txHash and url to view the transaction.

#### Get AVAX transaction

```
npm run play get-avax-tx "0x85f84b0be841d77b2d3108d6e8b9d75e97f23acc0cb729b7377980cccbdf8d28"
```

## Smart Contracts

This playground can also be used to develop and deploy smart contracts. Contracts can be written in [Solidity](https://docs.soliditylang.org/en/v0.8.17/) and then compiled/tested/deployed using [HardHat](https://hardhat.org/). Contracts can be found
in the [src/contracts directory](src/contracts/).

### Adding a new contract

To add a new contract, create a .sol file in the [src/contracts directory](src/contracts/) directory. You can optionally add
tests for the contract in the [src/hardhat-tests directory](src/hardhat-tests/). These tests can be run using `npm test`.

### Deploying a contract

To deploy a new contract, take the following steps:

1. Add the contract to the `deployments` array in the file [src/hardhat-scripts/deploy.ts](src/hardhat-scripts/deploy.ts).
2. Run the deploy script via `npm run hardhat:deploy`

You can set your private key to use when deploying using the `PRIVATE_KEY` environment variable. You can set the `NETWORK` environment variable to change the network being deployed to.

#### Deploy to local Hardhat node

You can run a local Hardhat node to deploy and interact with a smart contract locally before deploying to a real network. To do this, take the following steps:

1. To run a local Hardhat node, run the script `npm run hardhat:node`.
2. In another terminal, deploy your contracts: `npm run hardhat:deploy`.

#### Deploy to Avalanche Fuji Network

To deploy to Fuji, run `NETWORK=fuji npm run hardhat:deploy`. If you haven't set your `PRIVATE_KEY` environment variable, you'll need to do that as well.

After deploying, you might want to [verify your contract as well](#verifying-a-contract)

#### Deploy to Ethereum Sepolia Network

To deploy to Fuji, run `NETWORK=sepolia npm run hardhat:deploy`. If you haven't set your `PRIVATE_KEY` environment variable, you'll need to do that as well.

### Verifying a contract

After deploying, you might want to verify your contract as well on the block explorer (Etherscan, Snowtrace, etc.). This allows for ABI decoding both in the explorer and our applications. To do so, take the following steps:

1. Ensure you've set the environment variable for the explorer. E.g. on Avalanche, set `SNOWTRACE_API_KEY` to [your Snowtrace API key](https://docs.snowtrace.io/getting-started/viewing-api-usage-statistics).
2. Run Hardhat's verify command. It looks something like this: `npx hardhat verify --network <network> <contract_address> "<constructor_arguments>"`.

Example: To verify a contract deployed to Avalanche Fuji with a constructor argument of `10000000`, I used this command: `npx hardhat verify --network fuji 0xC893898E5ea42C5807521C82e7D868578018Ae9e "1000000"`
