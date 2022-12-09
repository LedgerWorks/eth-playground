import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("PointlessCurrencyERC20", () => {
  async function deployPointlessCurrency() {
    // Contracts are deployed using the first signer/accounts by default
    const [owner, otherAccount] = await ethers.getSigners();

    const PointlessCurrency = await ethers.getContractFactory("PointlessCurrencyERC20");
    const initialSupply = 350;
    const contract = await PointlessCurrency.deploy(initialSupply);

    return { contract, initialSupply, owner, otherAccount };
  }

  describe("deployment", () => {
    it("should set the right initial supply", async () => {
      const { contract, initialSupply, owner } = await loadFixture(deployPointlessCurrency);

      const ownerBalance = await contract.balanceOf(owner.address);
      expect(ownerBalance.toNumber()).to.equal(initialSupply);
    });
  });

  describe("transfer", () => {
    it("should emit an event on transfers", async () => {
      const { contract, owner, otherAccount } = await loadFixture(deployPointlessCurrency);

      await expect(contract.transfer(otherAccount.address, 10))
        .to.emit(contract, "Transfer")
        .withArgs(owner.address, otherAccount.address, 10);
    });

    it("should move balance from sender to recipient", async () => {
      const { contract, owner, otherAccount, initialSupply } = await loadFixture(
        deployPointlessCurrency
      );

      await contract.transfer(otherAccount.address, 10);
      const updatedOwnerBalance = await contract.balanceOf(owner.address);
      expect(updatedOwnerBalance.toNumber()).to.equal(initialSupply - 10);
      const otherAccountBalance = await contract.balanceOf(otherAccount.address);
      expect(otherAccountBalance.toNumber()).to.equal(10);
    });
  });
});
