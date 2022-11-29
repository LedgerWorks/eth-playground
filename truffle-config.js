const HDWalletProvider = require("@truffle/hdwallet-provider");
const apiKey = process.env.INFURA_API_KEY;
const mnemonic = process.env.METAMASK_MNEMONIC;

require("ts-node").register({
  files: true,
});

module.exports = {
  contracts_directory: `${__dirname}/src/contracts`,
  migrations_directory: `${__dirname}/src/migrations`,
  test_file_extension_regexp: /.*\.(ts|js)$/,
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    fuji: {
      provider: () => new HDWalletProvider(mnemonic, apiKey),
      network_id: "43113",
      gas: 4465030,
    },
  },
  compilers: {
    solc: {
      version: "0.8.17",
    },
  },
};
