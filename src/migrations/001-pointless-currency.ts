const contract = artifacts.require("PointlessCurrencyERC20");

const migration = function (deployer) {
  deployer.deploy(contract, 1000);
};
