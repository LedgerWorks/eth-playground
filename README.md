# Eth Playground

Provides an (incomplete) CLI interface for ethereum (eth) provider chains

## Setup

Create a .env file at the root. See [.env-example](.env-example).

## Use

```shell
npm install
npm run play -- help
```

## Examples

### Get a List of Available Subcommands

```
npm run play -- --help
```

### Get Help for a Subcommand

```
npm run play <subcommand> -- --help
```

### Avalanche

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
