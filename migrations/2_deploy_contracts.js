const KeyManager = artifacts.require("KeyManager");
const Identity = artifacts.require("Identity");
module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()
  const management = accounts[0]

  await deployer.deploy(Identity, management);
  await deployer.deploy(KeyManager);
};