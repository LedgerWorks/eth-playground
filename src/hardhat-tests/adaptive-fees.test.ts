import "@nomicfoundation/hardhat-chai-matchers";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

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
  });
});
