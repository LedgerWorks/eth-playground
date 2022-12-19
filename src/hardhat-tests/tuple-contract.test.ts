import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TupleContract", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function deployTupleContract(constructorParams: any, thing2: any) {
    const TupleContract = await ethers.getContractFactory("TupleContract");

    const contract = await TupleContract.deploy(constructorParams, thing2);

    return { contract };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function deployWithConstructor(constructorParams: any, thing2: any) {
    async function parameterizedDeploy() {
      return deployTupleContract(constructorParams, thing2);
    }
    return parameterizedDeploy;
  }

  describe("deployment", () => {
    it("should set the right properties for the tuple passed as an array", async () => {
      const storeName = "schnuckies";
      const availableCash = 500;
      const items = [{ name: "peanuts", quantity: 1000 }];
      const constructorParams = [storeName, availableCash];
      const { contract } = await loadFixture(deployWithConstructor(constructorParams, items));

      const firstItem = await contract._items(0);
      const itemCount = await contract._itemCount();
      const name = await contract._name();
      const initializedStore = await contract._tupleStore();

      // verify properties of the tuple passed to the constructor
      expect(initializedStore[0]).to.equal(storeName);
      expect(initializedStore[1]).to.equal(availableCash);

      // second parameter passed to constructor
      expect(itemCount).to.equal(1);
      expect(firstItem[0]).to.equal(items[0].name);
      expect(firstItem[1].toNumber()).to.equal(items[0].quantity);
      expect(name).to.equal(storeName);
    });

    it("should set the right properties for the tuple passed as an object", async () => {
      const storeStruct = {
        name: "wow",
        availableCash: 5020,
        items: [
          { name: "thing1", quantity: 10 },
          { name: "thing2", quantity: 20 },
        ],
      };

      const { contract } = await loadFixture(deployWithConstructor(storeStruct, storeStruct.items));

      const firstItem = await contract._items(0);
      const firstItemName = firstItem[0];
      const firstItemQuantity = firstItem[1].toNumber();

      const secondItem = await contract._items(1);
      const secondItemName = secondItem[0];
      const secondItemQuantity = secondItem[1].toNumber();

      const itemCount = await contract._itemCount();
      const name = await contract._name();
      const initializedStore = await contract._tupleStore();

      // verify properties of the tuple passed to the constructor
      expect(initializedStore[0]).to.equal(storeStruct.name);
      expect(initializedStore[1]).to.equal(storeStruct.availableCash);

      // second constructor parameter
      expect(itemCount).to.equal(2);
      expect(firstItemName).to.equal(storeStruct.items[0].name);
      expect(firstItemQuantity).to.equal(storeStruct.items[0].quantity);
      expect(secondItemName).to.equal(storeStruct.items[1].name);
      expect(secondItemQuantity).to.equal(storeStruct.items[1].quantity);
      expect(name).to.equal(storeStruct.name);
    });
  });

  describe("add item", () => {
    it("should update items in tuple store", async () => {
      const storeName = "schnuckies";
      const availableCash = 500;
      const items: string[] = [];
      const constructorParams = [storeName, availableCash];
      const { contract } = await loadFixture(deployWithConstructor(constructorParams, items));

      const itemCount = await contract._itemCount();
      expect(itemCount).to.equal(0);

      await contract.addItem({ name: "creamy peanut butter", quantity: 100 });
      await contract.addItem({ name: "crunchy peanut butter", quantity: 200 });

      const updatedItemCount = await contract._itemCount();
      expect(updatedItemCount).to.equal(2);
    });
  });

  describe("getAllItemsQuantity", () => {
    it("should update the total quantity of items", async () => {
      const storeName = "schnuckies";
      const availableCash = 500;
      const items: string[] = [];
      const constructorParams = [storeName, availableCash];
      const { contract } = await loadFixture(deployWithConstructor(constructorParams, items));

      const itemsTotal = await contract.getAllItemsQuantity();
      expect(itemsTotal).to.equal(0);

      await contract.addItem({ name: "creamy peanut butter", quantity: 100 });
      await contract.addItem({ name: "creamy peanut butter", quantity: 50 });

      const itemsUpdatedTotal = await contract.getAllItemsQuantity();
      expect(itemsUpdatedTotal).to.equal(150);
    });
  });
});
