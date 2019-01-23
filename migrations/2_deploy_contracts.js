var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var MyToken = artifacts.require("./MyToken.sol");

module.exports = function(deployer) {
  const _name = "Like Token";
  const _symbol = "LIKE";
  deployer.deploy(MyToken, _name, _symbol).then(function(){
    return deployer.deploy(SimpleStorage, MyToken.address);
  });

 
};
