// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {PriceHelper} from "./libraries/trader-joe/PriceHelper.sol";
import {SafeCast} from "./libraries/trader-joe/SafeCast.sol";

/**
 * Oftentimes, we come across sn
 * in smart contracts. This contract just allows us to plug
 * in those math equations and test them
 */
contract MathTester {
  using SafeCast for uint256;

  /**
   * Test Solidity's left-shift operator; found pretty heavily in TraderJoe
   * @param num The number to be left-shifted
   * @param shift The number of bits to shift `num` by
   */
  function shiftLeft(uint256 num, uint256 shift) public pure returns (uint256) {
    return num << shift;
  }

  struct TraderJoePrice {
    uint256 rawPrice;
    uint256 decimalPrice;
  }

  /**
   * TraderJoe uses a 128.128-binary fixed-point number system for prices.
   * They also use "bins" to hold liquidity at discrete prices. This
   * function recreates their price calculation logic for a given bin and tries to
   * give more human-readable output as for a price along with the
   * TraderJoe derived price
   * @param binId The id of the bin
   * @param binStep The bin step
   * @return traderJoePrice The calculated TraderJoe price
   */
  function getTraderJoeBinPrice(
    uint24 binId,
    uint16 binStep
  ) public pure returns (TraderJoePrice memory traderJoePrice) {
    uint256 _rawPrice = PriceHelper.getPriceFromId(binId, binStep);
    uint256 _decimalPrice = PriceHelper.convert128x128PriceToDecimal(_rawPrice);
    TraderJoePrice memory _traderJoePrice = TraderJoePrice(_rawPrice, _decimalPrice);
    return _traderJoePrice;
  }

  struct DeltaPrimeTraderJoeBinDetails {
    TraderJoePrice traderJoePrice;
    uint256 liquidity;
    uint256 valuation;
  }

  function getTokenXTotalBigPrice(
    uint8 decimals,
    uint256 traderJoeDecimalPrice,
    uint256 oraclePrice,
    uint256 liquidity,
    uint256 debtCoverage
  ) public pure returns (uint256) {
    uint256 weightedLiquidity = debtCoverage * liquidity;
    uint256 tokenDecimalMultiplier = 10 ** decimals;
    uint256 traderJoeDecimaledPrice = traderJoeDecimalPrice / 10 ** 18;
    return
      ((weightedLiquidity / traderJoeDecimaledPrice / tokenDecimalMultiplier) * oraclePrice) /
      10 ** 8;
  }

  function getTokenXTotalSmallPrice(
    uint8 decimals,
    uint256 traderJoeDecimalPrice,
    uint256 oraclePrice,
    uint256 liquidity,
    uint256 debtCoverage
  ) public pure returns (uint256) {
    return
      (((((debtCoverage * liquidity) / traderJoeDecimalPrice) * 10 ** 18) / 10 ** decimals) *
        oraclePrice) / 10 ** 8;
  }

  function getTraderJoeValue(
    uint8 decimals,
    uint256 traderJoeDecimalPrice,
    uint256 oraclePrice,
    uint256 liquidity,
    uint256 debtCoverage
  ) public pure returns (uint256) {
    return
      traderJoeDecimalPrice > 10 ** 24
        ? getTokenXTotalBigPrice(
          decimals,
          traderJoeDecimalPrice,
          oraclePrice,
          liquidity,
          debtCoverage
        )
        : getTokenXTotalSmallPrice(
          decimals,
          traderJoeDecimalPrice,
          oraclePrice,
          liquidity,
          debtCoverage
        );
  }

  function getDeltaPrimeTraderJoeBinDetails(
    uint24 binId,
    uint16 binStep,
    uint8 tokenXDecimals,
    uint256 tokenXDebtCoverage,
    uint256 tokenXOraclePrice,
    uint256 binReserveX,
    uint256 binReserveY
  ) public pure returns (DeltaPrimeTraderJoeBinDetails memory) {
    TraderJoePrice memory traderJoePrice = getTraderJoeBinPrice(binId, binStep);
    uint256 liquidity = (traderJoePrice.decimalPrice * binReserveX) / 10 ** 18 + binReserveY;
    uint256 valuation = getTraderJoeValue(
      tokenXDecimals,
      traderJoePrice.decimalPrice,
      tokenXOraclePrice,
      liquidity,
      tokenXDebtCoverage
    );
    return DeltaPrimeTraderJoeBinDetails(traderJoePrice, liquidity, valuation);
  }
}
