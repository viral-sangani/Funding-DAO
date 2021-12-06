const FundingDao = artifacts.require("FundingDao");

module.exports = function (deployer) {
  deployer.deploy(FundingDao);
};
