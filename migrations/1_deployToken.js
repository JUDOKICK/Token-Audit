const fs = require('fs');
const path = require('path')

const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { loadAddressBook, saveAddressBook } = require('../utils/addressBookManager');

const RenderToken = artifacts.require("RenderTokenMatic");
const Escrow = artifacts.require("EscrowMatic");

const name = "RenderToken";
const symbol = "RNDR";

module.exports = async (deployer, network, accounts) => {
  const owner = accounts[0];
  const childChainManagerProxy = accounts[0];

  const networkId = await web3.eth.net.getId();
  let addressBook = loadAddressBook(networkId);
  let addresses = addressBook[networkId];
  let renderToken;
  let escrow;

  console.log("networkId:", networkId)

  if (!addresses["RenderTokenMatic"]) {
    console.log("Deploying RenderTokenMatic...");
    await deployProxy(RenderToken, [owner, childChainManagerProxy, name, symbol], { deployer, initializer: 'initialize' });
    
    renderToken = await RenderToken.deployed();
    console.log("Deployed RenderToken at", renderToken.address);

    console.log("With the following parameters:");
    console.log("Owner:", await renderToken.owner())
    console.log("childChainManagerProxy:", await renderToken.childChainManagerProxy())
    console.log("Name:", await renderToken.name())
    console.log("Symbol:", await renderToken.symbol())
  } else {
      console.log("RenderTokenMatic address found:")
      console.log(addresses["RenderTokenMatic"])
  }

  if (!addresses["EscrowMatic"]) {
    console.log("Deploying Escrow...");
    await deployProxy(Escrow, [owner, renderToken.address], { deployer, initializer: 'initialize' });
    
    escrow = await Escrow.deployed();
    console.log("Deployed Escrow at", escrow.address);
    addresses["EscrowMatic"] = escrow.address

    console.log("With the following parameters:");
    console.log("Owner:", await escrow.owner())
    console.log("Disbursal address:", await escrow.disbursalAddress())
    console.log("RenderToken address:", await escrow.renderTokenAddress())
  } else {
    console.log("EscrowMatic address found:")
    console.log(addresses["EscrowMatic"])
  }

  if (!addresses["RenderTokenMatic"]) {
    console.log("Setting RenderTokenMatic escrow address...")
    await renderToken.setEscrowContractAddress(escrow.address);
    addresses["RenderTokenMatic"] = renderToken.address
  }

  console.log("Saving addresses to addressBook.json:")
  console.log({[networkId]: addresses})
  addressBook[networkId] = addresses
  saveAddressBook(addressBook)
};