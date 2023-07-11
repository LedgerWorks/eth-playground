// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./WadRayMath.sol";

contract WadRayContract {
  string public constant name =
    "A contract that uses Aave wad/ray functions to understand them better";

  function multiply(uint256 a, uint256 b) public pure returns (uint wadProduct) {
    return WadRayMath.wadMul(a, b);
  }

  function divide(uint256 a, uint256 b) public pure returns (uint wadQuotient) {
    return WadRayMath.wadDiv(a, b);
  }
}
