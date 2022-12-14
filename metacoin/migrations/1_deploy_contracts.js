const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");
const MetaCoinProxy = artifacts.require("MetaCoinProxy");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin).then(() => {
    console.log("**********************DEPLOYING PROXY**************************")
    console.log('PROXY ADDRESS:', MetaCoin.address);
    return deployer.deploy(MetaCoinProxy, MetaCoin.address);
  });
};
