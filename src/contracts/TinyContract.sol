// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// Used to just get a small amount of bytecode for our bytecode validator
// and other minimal test cases
contract TinyContract {
  function doIt() public pure returns (uint) {
    return 1;
  }
}
