const fs = require('fs');
const path = require('path')
const papaparse = require('papaparse');
const { BN, toWei, fromWei } = web3.utils;
const { abi } = web3.eth;

const Escrow = artifacts.require('EscrowMatic');
const RenderToken = artifacts.require('RenderTokenMatic');

const { loadAddressBook } = require('../utils/addressBookManager');

module.exports = async deployer => {
  try {
    accounts = await web3.eth.getAccounts();
    const owner = accounts[0]
    const childChainManagerProxy = accounts[0];

    console.log("Script is running from:", owner)

    const networkId = await web3.eth.net.getId();
    let addressBook = loadAddressBook(networkId);
    let addresses = addressBook[networkId];

    let renderToken, escrow

    console.log("networkId:", networkId)

    // If the Escrow address is provided in the addressBook - use it. Otherwise - deploy a mock
    if (addresses["RenderTokenMatic"]) {
      console.log("Found RenderTokenMatic at:", addresses["RenderTokenMatic"])
      renderToken = await RenderToken.at(addresses["RenderTokenMatic"]);

      // Add funds to accounts
      let renderTokenDecimalFactor = await renderToken.decimals();

      // Add funds to accounts
      let amount = (new BN(10000000)).mul(new BN(10).pow(renderTokenDecimalFactor));

      console.log("Depositing 10000000 mocked RNDR to", owner)
      await renderToken.deposit(owner, abi.encodeParameter('uint256', amount.toString()), {from: childChainManagerProxy})

      console.log("Owner's balance:", fromWei(await renderToken.balanceOf(owner)), "RNDR")
    } else {
      console.log("Address for RenderTokenMatic not found in the addressBook for network", networkId)
      console.log("Please run truffle migrations to deploy mocks")
    }
  } catch(e) {
    console.log(e)
  }
  process.exit()
}