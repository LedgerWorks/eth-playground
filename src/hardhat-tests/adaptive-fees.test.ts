import "@nomicfoundation/hardhat-chai-matchers";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { writeFile } from "fs/promises";
import { product as arrayProduct } from "cartesian-product-generator";
import { ethJsonReplacer } from "./eth-json";
import { range } from "./range";

describe("AdaptiveFee", () => {
  async function deployAdaptiveFees() {
    const [owner] = await ethers.getSigners();
    const AdaptiveFeeLibrary = await ethers.getContractFactory("AdaptiveFee");
    const adaptiveFeeLibrary = await AdaptiveFeeLibrary.deploy();
    const AdaptiveFeesTestFactory = await ethers.getContractFactory("AdaptiveFeeTest", {
      libraries: {
        AdaptiveFee: await adaptiveFeeLibrary.getAddress(),
      },
    });
    const contract = await AdaptiveFeesTestFactory.deploy();

    return { contract, owner };
  }

  describe("constructor", () => {
    it("should return expected fee result", async () => {
      const { contract } = await loadFixture(deployAdaptiveFees);
      const result = await contract.getFee(
        BigInt("3395285563163"),
        BigInt("829390885506055569978528"),
        {
          alpha1: 4771,
          alpha2: 7483,
          beta1: 3219,
          beta2: 12920,
          gamma1: 2678,
          gamma2: 3892,
          volumeBeta: 5747,
          volumeGamma: 3645,
          baseFee: 300,
        }
      );

      expect(result).to.equal(12554);
    });

    // Leaving this commented out in case we want to run it in the future
    // it("should return expected fee results over a gradient of volatility/volume per liquidities", async () => {
    //   const maxVolatility = BigInt("20000"); // 3395285563163
    //   const volatilitySteps = range(BigInt(0), maxVolatility, maxVolatility / BigInt(100));
    //   const maxVolume = BigInt("20000"); // 829390885506055569978528
    //   const volumeSteps = range(BigInt(0), maxVolume, maxVolume / BigInt(100));
    //   const { contract } = await loadFixture(deployAdaptiveFees);

    //   const volatilityVolumeCombos = Array.from(arrayProduct(volatilitySteps, volumeSteps));

    //   const feeConfiguration = {
    //     alpha1: 4771,
    //     alpha2: 7483,
    //     beta1: 3219,
    //     beta2: 12920,
    //     gamma1: 267,
    //     gamma2: 389,
    //     volumeBeta: 5747,
    //     volumeGamma: 364,
    //     baseFee: 300,
    //   };
    //   const results = await Promise.all(
    //     volatilityVolumeCombos.map(async ([volatility, volumePerLiquidity]) => {
    //       const fee = await contract.getFee(volatility, volumePerLiquidity, feeConfiguration);
    //       return { volatility, volumePerLiquidity, fee };
    //     })
    //   );

    //   await writeFile(
    //     "/tmp/adaptive-fee-results.json",
    //     JSON.stringify(results, ethJsonReplacer, 2)
    //   );
    // });
  });
});
