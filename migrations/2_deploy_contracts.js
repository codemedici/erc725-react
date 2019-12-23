const Lottery = artifacts.require("Lottery");
const Attacker = artifacts.require("Attacker");

module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Lottery);

  const seed = 13
  // const feePercent = 10

  await deployer.deploy(Attacker, seed);//, feeAccount, feePercent)
};