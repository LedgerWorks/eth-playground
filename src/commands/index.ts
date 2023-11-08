import * as createAvaxAddress from "./create-avax-address";
import * as getAvaxTx from "./get-avax-tx";
import * as sendAvax from "./send-avax";
import * as getAvaxBalance from "./get-avax-balance";
import * as createWallet from "./create-wallet";
import coinFlipCommands from "./coinflip";

export default [
  sendAvax,
  getAvaxTx,
  createAvaxAddress,
  getAvaxBalance,
  createWallet,
  ...coinFlipCommands,
];
