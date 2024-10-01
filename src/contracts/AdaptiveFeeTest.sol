// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import "./AdaptiveFee.sol";

contract AdaptiveFeeTest {
  function getFee(
    uint88 volatility,
    uint256 volumePerLiquidity,
    Configuration memory config
  ) public pure returns (uint16 fee) {
    return AdaptiveFee.getFee(volatility, volumePerLiquidity, config);
  }
}
