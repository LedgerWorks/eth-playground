// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// Used to just get a small amount of bytecode for our bytecode validator.
// This contract is used in test cases where the function "doIt()" is expected,
// but it is not present in the bytecode. See the TinyContract.sol file
// that contains the positive case for "doIt()" being present.
contract TinyContractMissingDesiredFunction {
  function dont() public pure returns (uint) {
    return 1;
  }
}
