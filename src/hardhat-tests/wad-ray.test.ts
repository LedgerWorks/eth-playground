import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("WadRay", () => {
  async function deployWadRayMath() {
    // Contracts are deployed using the first signer/accounts by default
    const [owner] = await ethers.getSigners();

    const WadRayContract = await ethers.getContractFactory("WadRayContract");
    const contract = await WadRayContract.deploy();

    return { contract, owner };
  }

  const smallNumberCases = [
    {
      a: 10,
      b: 11,
      product: 110,
      quotient: 0.9090909090909091,
      wadProduct: 0,
      wadQuotient: BigInt("909090909090909091"),
    },
    {
      a: 1000,
      b: 500,
      product: 500000,
      quotient: 2,
      wadProduct: BigInt("0"),
      wadQuotient: BigInt("2000000000000000000"),
    },
  ];
  const largeNumberCases = [
    {
      a: BigInt("10000000000000000000"), // 10E18
      b: BigInt("11000000000000000000"), // 11E18
      wadProduct: BigInt("110000000000000000000"), // 110E18
      wadQuotient: BigInt("909090909090909091"), // 110E18
    },
  ];

  describe("wadMul", () => {
    // Small numbers get floor'ed to 0
    smallNumberCases.forEach(({ a, b, product, wadProduct }) => {
      it(`should multiply two small numbers: ${a}, ${b}`, async () => {
        const { contract } = await loadFixture(deployWadRayMath);

        const result = await contract.multiply(a, b);
        expect(BigInt(a) * BigInt(b)).to.equal(product);
        expect(result).to.equal(wadProduct);
      });
    });

    largeNumberCases.forEach(({ a, b, wadProduct }) => {
      it(`should multiply two large numbers: ${a}, ${b}`, async () => {
        const { contract } = await loadFixture(deployWadRayMath);

        const result = await contract.multiply(a, b);
        expect(result).to.equal(wadProduct);
      });
    });
  });

  describe("wadDiv", () => {
    // Small numbers get floor'ed to 0
    smallNumberCases.forEach(({ a, b, quotient, wadQuotient }) => {
      it(`should divide two small numbers: ${a}, ${b}`, async () => {
        const { contract } = await loadFixture(deployWadRayMath);

        const result = await contract.divide(a, b);
        expect(a / b).to.equal(quotient);
        expect(result).to.equal(wadQuotient);
      });
    });

    largeNumberCases.forEach(({ a, b, wadQuotient }) => {
      it(`should divide two large numbers: ${a}, ${b}`, async () => {
        const { contract } = await loadFixture(deployWadRayMath);

        const result = await contract.divide(a, b);
        expect(result).to.equal(wadQuotient);
      });
    });
  });
});
