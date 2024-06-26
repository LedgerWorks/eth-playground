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
});
