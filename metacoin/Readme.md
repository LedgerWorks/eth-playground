# setting up environment

## install truffle dev tools

Install using node, brew caused some file permissions headache

```sh
npm install -g truffle
```

check the version:

```sh
truffle -v
```

## download gnachi

https://trufflesuite.com/ganache/

## install solidity in vscode

Just do it

## truffle configuration

Get the port gnachi is listening on after you start it up - you'll need this for the truffle-config.js

```sh
lsof -i -P | grep LISTEN
```

You should see something like this:

```sh
Ganache   53630 brandon   39u  IPv4 0x2fbf2529755303ab      0t0  TCP localhost:7545 (LISTEN)
com.docke 79102 brandon   32u  IPv4 0x2fbf25297545994b      0t0  TCP *:55468 (LISTEN)
vpnkit-br 79131 brandon    8u  IPv4 0x2fbf25297545994b      0t0  TCP *:55468 (LISTEN)
Discord   82656 brandon   51u  IPv4 0x2fbf2529756323e3      0t0  TCP localhost:6463 (LISTEN)
```

edit the truffle-config.js to include this line so you have a UI to see things in and don't need to run a bunch of random node code everytime you want to see state:

```sh
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
  }
};
```

Alternately, if your name is cory/chad/ryan, you'll probably just suffer through the node and run it using the headless version built in:

```sh
truffle develop
```

which will show you shit like this:

```sh
Truffle Develop started at http://127.0.0.1:9545/

Accounts:
(0) 0x627306090abab3a6e1400e9345bc60c78a8bef57
(1) 0xf17f52151ebef6c7334fad080c5704d77216b732
(2) 0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef
(3) 0x821aea9a577a9b44299b9c15c88cf3087f3b5544
(4) 0x0d1d4e623d10f9fba5db95830f7d3839406c6af2
(5) 0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e
(6) 0x2191ef87e392377ec08e7c08eb105ef5448eced5
(7) 0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5
(8) 0x6330a553fc93768f612722bb8c2ec78ac90b3bbc
(9) 0x5aeda56215b167893e80b4fe645ba6d5bab767de

Private Keys:
(0) c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3
(1) ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f
(2) 0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1
(3) c88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c
(4) 388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418
(5) 659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63
(6) 82d052c865f5763aad42add438569276c00d3d88a2d062d36b2bae914d58b8c8
(7) aa3680d5d48a8283413f7a108367c7299ca73f553735860a87b08f39395618b7
(8) 0f62d96d6675f32685bbdb8ac13cda7c23436f63efbb9d07700d8669ff12b7c4
(9) 8d5366123cb560bb606379f90a0bfd4769eecc0557f1b362dcae9012b548b1e5

Mnemonic: candy maple cake sugar pudding cream honey rich smooth crumble sweet treat

⚠️  Important ⚠️  : This mnemonic was created for you by Truffle. It is not secure.
Ensure you do not use it on production blockchains, or else you risk losing funds.

truffle(development)>
```

## compile

```sh
truffle compile
```

This will create a build/ directory at the root. The .json files created are referred to as "abi files". You'll need those to decode your contract execution log output.

## migrate

migrate just means deploy tot he network configured:

```sh
truffle migrate
```

At this point you should see 3 blocks in your gnachi instance.

- The first is block 0, obviously since things are sequential it makes sense that we start with 1 block
- The next block is block 1, which corresponds to this line in your migration

```sh
const ConvertLib = artifacts.require("ConvertLib");
...
deployer.deploy(ConvertLib);
```

- The next block is block 2, which corresponds to this line in your migration

```sh
const MetaCoin = artifacts.require("MetaCoin");
...
deployer.deploy(MetaCoin);
```

## do ledger things

Using the truffle console you can act like a 'wallet' and issue commands that create blocks/transactions on your local gnachi chain:

```sh
truffle console
```

```sh
let instance = await MetaCoin.deployed()
let accounts = await web3.eth.getAccounts()
let balance = await instance.getBalance(accounts[0])
balance.toNumber();
let ether = await instance.getBalanceInEth(accounts[0])
ether.toNumber()
instance.sendCoin(accounts[1], 500)

(await instance.getBalance(accounts[0])).toNumber()
```

## issues

when running tests, you'll see this:

```sh
truffle test
This version of µWS is not compatible with your Node.js build:

Error: Cannot find module './uws_darwin_arm64_102.node'
Falling back to a NodeJS implementation; performance may be degraded.
```

I'm going to need to play a little with this library to get that module to load correctly...
