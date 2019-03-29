const TicTacToe = artifacts.require("TicTacToe.sol");

module.exports = function (deployer) {
  deployer.deploy(TicTacToe, {value: web3.utils.toWei("0.1", "ether")});
};