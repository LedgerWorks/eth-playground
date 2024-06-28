import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Math tests", () => {
  async function deployMathTester() {
    const [owner] = await ethers.getSigners();
    const MathTesterFactory = await ethers.getContractFactory("MathTester");
    const contract = await MathTesterFactory.deploy();

    return { contract, owner };
  }

  /**
   * A test case taken from an actual Trader Joe bin created via DeltaPrime.
   * Trader Joe Bin Id: 8380293
   * Trader Joe Bin Steps: 10
   * LB Contract: https://arbiscan.io/address/0x0be4ac7da6cd4bad60d96fbc6d091e1098afa358#readProxyContract
   * Transaction adding liquidity from smart loan: https://arbiscan.io/tx/0x7cc31f825c6869ab24e9132b42bdabea75d361c74b0eb3db48f9f24c30db1454
   */
  function getTraderJoeBinTestCase() {
    // The id of the bin containing a subset of the invested assets at a given price point.
    const binId = 8380293;
    // The bin step (see https://docs.traderjoexyz.com/concepts/concentrated-liquidity#bin-pricing)
    const binSteps = 10;
    // The address of the first token in the liquidity pair
    const tokenX = "0x912CE59144191C1204E64559FE8253a0e49E6548";
    // The amount of token x in the bin
    const binTokenXReserves = BigInt("1920399509864690844257");
    // The address of the second token in the liquidity pair
    const tokenY = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
    // The amount of token y in the bin (zero in this case)
    // See: https://docs.traderjoexyz.com/concepts/bin-liquidity#market-aggregation as to why reserves are often zero
    const binTokenYReserves = BigInt("0");
    return {
      binId,
      binSteps,
      tokenX,
      tokenXDecimals: 18,
      binTokenXReserves,
      tokenY,
      tokenYDecimals: 18,
      binTokenYReserves,
    };
  }

  describe("leftShifting", () => {
    [
      { shift: 0, expected: 1 },
      { shift: 1, expected: 2 },
      { shift: 2, expected: 4 },
      { shift: 4, expected: 16 },
      { shift: 128, expected: BigInt("340282366920938463463374607431768211456") },
    ].forEach(({ shift, expected }) => {
      it(`should return 2**<shift> when <num> is 1: ${shift}`, async () => {
        const { contract } = await loadFixture(deployMathTester);

        const result = await contract.shiftLeft(1, shift);

        expect(result).to.equal(expected);
      });
    });

    [
      { num: 2, shift: 0, expected: 2 },
      { num: 2, shift: 1, expected: 4 },
      { num: 4, shift: 1, expected: 8 },
      { num: 5, shift: 2, expected: 20 },
      { num: 5, shift: 128, expected: BigInt("1701411834604692317316873037158841057280") },
    ].forEach(({ num, shift, expected }) => {
      it(`should return <num> * 2**<shift>: num=${num}, shift=${shift}`, async () => {
        const { contract } = await loadFixture(deployMathTester);

        const result = await contract.shiftLeft(num, shift);

        expect(result).to.equal(expected);
      });
    });
  });

  describe("getTraderJoeBinPrice", () => {
    it("should return derived TraderJoe price", async () => {
      const { contract } = await loadFixture(deployMathTester);
      const { binId, binSteps } = getTraderJoeBinTestCase();

      const result = await contract.getTraderJoeBinPrice(binId, binSteps);

      expect(result.rawPrice).to.equal(BigInt("83653709612360649898757686803092462"));
      expect(result.decimalPrice).to.equal(BigInt("245836157686645"));
    });
  });

  describe("getDeltaPrimeTraderJoeBinDetails", () => {
    /**
     * An extension of the base Trader Joe test case
     * that also includes DeltaPrime specific data (e.g. debt coverage ratios)
     */
    function getDeltaPrimeTraderJoeBinTestCase() {
      // Pulled from DeltaPrime's token manager
      // debtCoverage=<borrowing power ratio>
      // See: https://docs.deltaprime.io/prime-brokerage-account/health-and-borrowing-power/calculations
      // Token manager: https://arbiscan.io/address/0x0a0d954d4b0f0b47a5990c0abd179a90ff74e255#code
      const tokenXDebtCoverage = BigInt("833333333333333333");
      const tokenYDebtCoverage = BigInt("833333333333333330");
      const tokenXOraclePrice = BigInt("82817221");
      const tokenYOraclePrice = BigInt("345473254471");
      return {
        ...getTraderJoeBinTestCase(),
        tokenXDebtCoverage,
        tokenXOraclePrice,
        tokenYDebtCoverage,
        tokenYOraclePrice,
      };
    }

    it("should return derived TraderJoe price", async () => {
      const { contract } = await loadFixture(deployMathTester);
      const {
        binId,
        binSteps,
        tokenXDecimals,
        tokenXDebtCoverage,
        tokenXOraclePrice,
        binTokenXReserves,
        binTokenYReserves,
      } = getDeltaPrimeTraderJoeBinTestCase();

      const result = await contract.getDeltaPrimeTraderJoeBinDetails(
        binId,
        binSteps,
        tokenXDecimals,
        tokenXDebtCoverage,
        tokenXOraclePrice,
        binTokenXReserves,
        binTokenYReserves
      );

      expect(result.traderJoePrice.rawPrice).to.equal(
        BigInt("83653709612360649898757686803092462")
      );
      expect(result.traderJoePrice.decimalPrice).to.equal(BigInt("245836157686645"));
      expect(result.liquidity).to.equal(BigInt("472103636728451908"));
      expect(result.valuation).to.equal(BigInt("1325351255139631512341"));
    });
  });
});
