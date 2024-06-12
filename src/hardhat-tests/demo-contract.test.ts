import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DemoContract", () => {
  async function deployDemoContract() {
    const [owner, otherAccount] = await ethers.getSigners();

<<<<<<< HEAD
    const DemoContract = await ethers.getContractFactory("DemoContract");
=======
    const DemoContractFactory = await ethers.getContractFactory("DemoContract");
>>>>>>> 8ba8ac0e532311d57e28d6a5e3ccaea0d6c03097
    const name = "Ledger Works Demo Contract";
    const symbol = "LWORKS";
    const version = "1";

    const contract = await DemoContractFactory.deploy(name, symbol, version);

    return { contract, name, symbol, version, owner, otherAccount };
  }

  describe("deployment", () => {
    it("should set the name, symbol, & version", async () => {
      const { contract, name, symbol, version } = await loadFixture(deployDemoContract);

      const contractName = await contract.name();
      const contractSymbol = await contract.symbol();
      const contractVersion = await contract.version();

      expect(name).to.equal(contractName);
      expect(symbol).to.equal(contractSymbol);
      expect(version).to.equal(contractVersion);
    });
  });

  describe("emergencyPause", () => {
    it("should emit emergency pause event", async () => {
      const { contract, owner } = await loadFixture(deployDemoContract);

      await expect(contract.emergencyPause())
        .to.emit(contract, "EmergencyEvent")
        .withArgs(owner.address, "emergencyPause");
    });
  });

  describe("emergencyResume", () => {
    it("should emit emergency resume event", async () => {
      const { contract, owner } = await loadFixture(deployDemoContract);

      await expect(contract.emergencyResume())
        .to.emit(contract, "EmergencyEvent")
        .withArgs(owner.address, "emergencyResume");
    });
  });
});
