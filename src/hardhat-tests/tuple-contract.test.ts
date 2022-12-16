import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe.only("TupleContract", () => {
  async function deployTupleContract(initialStoreStruct: any) {
    const TupleContract = await ethers.getContractFactory("TupleContract");

    const contract = await TupleContract.deploy(initialStoreStruct);

    return { contract };
  }

  describe("deployment", () => {
    it("should set the right properties for the tuple passed as an array", async () => {
      const storeName = "schnuckies";
      const availableCash = 500;
      const items = ["peanuts"];

      const parameterizedDeploy = async () =>
        deployTupleContract([storeName, availableCash, items]);
      const { contract } = await loadFixture(parameterizedDeploy);

      const firstItem = await contract._items(0);
      const itemCount = await contract._itemCount();
      const name = await contract._name();
      const initializedStore = await contract._tupleStore();

      // verify properties of the tuple passed to the constructor
      expect(initializedStore[0]).to.equal(storeName);
      expect(initializedStore[1]).to.equal(availableCash);
      // for some reason array is not returned in the tuple property
      // expect(initializedStore[2]).to.equal(items);

      // other properties set in constructor with tuple values
      expect(itemCount).to.equal(1);
      expect(firstItem).to.equal(items[0]);
      expect(name).to.equal(storeName);
    });

    it("should set the right properties for the tuple passed as an object", async () => {
      const storeStruct = {
        name: "wow",
        availableCash: 5020,
        items: ["thing1", "thing2"],
      };

      const parameterizedDeploy = async () => deployTupleContract(storeStruct);
      const { contract } = await loadFixture(parameterizedDeploy);

      const firstItem = await contract._items(0);
      const secondItem = await contract._items(1);
      const itemCount = await contract._itemCount();
      const name = await contract._name();
      const initializedStore = await contract._tupleStore();

      // verify properties of the tuple passed to the constructor
      expect(initializedStore[0]).to.equal(storeStruct.name);
      expect(initializedStore[1]).to.equal(storeStruct.availableCash);
      // for some reason array is not returned in the tuple property
      // expect(initializedStore[2]).to.equal(storeStruct.items);

      // other properties set in constructor with tuple values
      expect(itemCount).to.equal(2);
      expect(firstItem).to.equal(storeStruct.items[0]);
      expect(secondItem).to.equal(storeStruct.items[1]);
      expect(name).to.equal(storeStruct.name);
    });
  });
});
