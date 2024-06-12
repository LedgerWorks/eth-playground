// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// Used to just get a small amount of bytecode for our bytecode validator.
// This contract is used in test cases where the function "doIt()" is expected.
// This function presents an edge-case where the expected bytecode is found (but not as a function)
// but there is an actual "fallback" function present.
contract TinyContractWithFallback {
  event FallbackCalled();

  function dont() public pure returns (bytes4) {
    // Directly put the bytecode of doIt() here to test for bytecode present, but not as a function
    bytes4 data = 0xb29f0835;
    return data;
  }

  fallback() external {
    // The fallback makes it so that actual callability of a function is indeterminate without actually executing
    emit FallbackCalled();
  }
}
