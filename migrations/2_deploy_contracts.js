const LinkItToken = artifacts.require("LinkItToken");

module.exports = function (deployer, network, accounts) {
  const name = "LinkIt Token"; // Name of your token
  const symbol = "LIT"; // Symbol of your token
  const decimals = 18; // Number of decimals for your token
  const initialOwner = accounts[0]; // Deployer's address

  deployer.deploy(LinkItToken, name, symbol, decimals, initialOwner);
};
