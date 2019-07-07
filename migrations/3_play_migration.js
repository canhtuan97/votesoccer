const PlaySoccer = artifacts.require("PlaySoccer");

module.exports = function(deployer){
	deployer.deploy(PlaySoccer);
};