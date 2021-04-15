const fs = require('fs');
const path = require('path')
const prompt =  require('prompt-async')
const papaparse = require('papaparse');
const { BN, fromWei } = web3.utils;

const Escrow = artifacts.require('Escrow');
const LegacyToken = artifacts.require('LegacyToken');
const RenderToken = artifacts.require('RenderToken');

const { loadAddressBook, saveAddressBook } = require('../utils/addressBookManager');

const schema = {
    properties: {
      mocks: {
        pattern: /^[a-zA-Z\s\-]+$/,
        message: 'Name must be only letters, spaces, or dashes',
        required: true,
		description: "Create Mock Jobs on network ? [yes/no]"
      }
    }
  };

module.exports = async deployer => {

  prompt.start();
  try {
    accounts = await web3.eth.getAccounts();
    const owner = accounts[0]
    console.log("Script is running from:", owner)

    const networkId = await web3.eth.net.getId();
    let addressBook = loadAddressBook(networkId);
    let addresses = addressBook[networkId];

    let legacyToken, renderToken, escrow



    console.log("networkId:", networkId)

    // If the Escrow address is provided in the addressBook - use it. Otherwise - deploy a mock
    if (!addresses["Escrow"]) {
      console.log("Deploying mock contracts...")
      // Create legacy token for migrations
      console.log("Deploying LegacyToken...")
      legacyToken = await LegacyToken.new('Legacy Token', 'LTX', 18);
      addresses["LegacyToken"] = legacyToken.address
      console.log("LegacyToken deployed at:", legacyToken.address)

      // Create and initialize Render Token contract
      console.log("Deploying RenderToken...")
      renderToken = await RenderToken.new();
      console.log("RenderToken deployed at:", renderToken.address)
      console.log("Initializing RenderToken...")
      await renderToken.initialize(owner, legacyToken.address);
      addresses["RenderToken"] = renderToken.address

      // Create and initialize Escrow contract
      console.log("Deploying Escrow...")
      escrow = await Escrow.new();
      console.log("Escrow deployed at:", escrow.address)
      console.log("Initializing Escrow...")
      await escrow.initialize(owner, renderToken.address);
      addresses["Escrow"] = escrow.address

      // Set escrow contract address
      console.log("Setting RenderToken Escrow address to", escrow.address, "...")
      await renderToken.setEscrowContractAddress(escrow.address);

      let renderTokenDecimalFactor = await renderToken.decimals();

      // Add funds to accounts
      let amount = (new BN(10000000)).mul(new BN(10).pow(renderTokenDecimalFactor));
      console.log("Minting", fromWei(amount), "RNDR to", owner, "...")
      await legacyToken.mint(owner, amount);
      let balance = await legacyToken.balanceOf(owner);
      console.log("Approving", fromWei(amount), "RNDR for migration...")
      await legacyToken.approve(renderToken.address, balance);
      console.log("Migrating...")
      await renderToken.migrate();
	}
	else {
		//Contracts are already deployed, so create interfaces instead
		console.log("Connecting to existing contracts...");
		legacyToken = await LegacyToken.deployed();
		console.log("Loaded LegacyToken at: ", legacyToken.address);
		escrow = await Escrow.deployed();
		console.log("Escrow loaded at: ", escrow.address);
		renderToken = await RenderToken.deployed();
		console.log("RenderToken loaded at: ", renderToken.address);

	}

	let renderTokenDecimalFactor = await renderToken.decimals();

	if (networkId === 5 || networkId === 5777){
		let decision = false;
		const {mocks} = await prompt.get(schema);
		console.log(mocks);
        if(mocks === 'yes' || mocks === 'y'){
            //Testnet please create mock jobs
            const csvJobIds = fs.readFileSync(path.join(__dirname, "../jobIds.csv"), { encoding: 'utf8' });
            const jobIds = papaparse.parse(csvJobIds, { delimiter: ',', header: true, skipEmptyLines: true }).data.map(item => item.jobId);

            // Create mock escrowed jobIds
            console.log("Escrowing mock jobIds...")
            let amount = (new BN(100)).mul(new BN(10).pow(renderTokenDecimalFactor));
            for (jobId of jobIds) {
                amount = amount.mul(new BN(2))
                console.log("Escrowing", fromWei(amount), "RNDR at", jobId)
                await renderToken.holdInEscrow(jobId, amount);
            }
        }
	  console.log("Saving addresses to addressBook.json:");
      console.log({[networkId]: addresses});
      addressBook[networkId] = addresses;
      saveAddressBook(addressBook);

	}
	else {
      console.log("Addresses found:")
      console.log(addresses)
      console.log("Proceed to next step")
    }
  } catch(e) {
    console.log(e)
  }
  process.exit()
}
