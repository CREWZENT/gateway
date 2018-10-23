

const StandardToken = artifacts.require("../node_modules/zeppelin-solidity/contracts/token/ERC20/StandardToken.sol");
const AccessMint = artifacts.require("./AccessMint.sol");
const BurnableToken = artifacts.require("../node_modules/zeppelin-solidity/contracts/token/ERC20/BurnableToken.sol");
const TeneCoin = artifacts.require("./TeneCoin.sol");

const HrTest = artifacts.require("./HrTest.sol");

module.exports = (deployer) => {
  deployer.deploy(StandardToken);
  deployer.deploy(AccessMint);
  deployer.deploy(BurnableToken);
  deployer.link(StandardToken, TeneCoin);
  deployer.link(AccessMint, TeneCoin);
  deployer.link(BurnableToken, TeneCoin);
  deployer.deploy(TeneCoin, 0, "TeneCoin", "Tene");
  
  deployer.deploy(HrTest);
};
