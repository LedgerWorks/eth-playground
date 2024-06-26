// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Oftentimes, we come across some confusing math equation
 * in smart contracts. This contract just allows us to plug
 * in those math equations and test them
 */
contract MathTester {
  /**
   * Test Solidity's left-shift operator; found pretty heavily in TraderJoe
   * @param num The number to be left-shifted
   * @param shift The number of bits to shift `num` by
   */
  function shiftLeft(uint256 num, uint256 shift) public pure returns (uint256) {
    return num << shift;
  }
}
