import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("UpdatableContract", () => {
  async function deployUpdatableContract() {
    // Contracts are deployed using the first signer/accounts by default
    const V1Subcontract = await ethers.getContractFactory("V1Subcontract");
    const v1Subcontract = await V1Subcontract.deploy();
    const V2Subcontract = await ethers.getContractFactory("V2Subcontract");
    const v2Subcontract = await V2Subcontract.deploy();
    const UpdatableContract = await ethers.getContractFactory("UpdatableContract");
    const updatableContract = await UpdatableContract.deploy(v1Subcontract);
    // Need to attach to one of the sub-contract definition to appease Typescript type definitions
    const contractProxy = V1Subcontract.attach(updatableContract);

    return {
      updatableContract,
      contractProxy,
      v2Subcontract,
    };
  }

  describe("deployment", () => {
    it("should allow calling proxied methods", async () => {
      const { contractProxy } = await loadFixture(deployUpdatableContract);

      const startCount = await contractProxy.getCount();
      expect(startCount).to.equal(0);
      await contractProxy.increment();
      const endCount = await contractProxy.getCount();
      expect(endCount).to.equal(1);
    });

    it("should allow 'updating' the contract", async () => {
      const { contractProxy, updatableContract, v2Subcontract } = await loadFixture(
        deployUpdatableContract
      );

      await contractProxy.increment();
      const startCount = await contractProxy.getCount();
      expect(startCount).to.equal(1);
      await updatableContract.updateContract(v2Subcontract);
      await contractProxy.increment();
      const endCount = await contractProxy.getCount();
      expect(endCount).to.equal(3);
    });
  });
});
