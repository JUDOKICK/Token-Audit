const fs = require('fs');
const path = require('path')
const papaparse = require('papaparse');
const { BN, fromWei } = web3.utils;

const Escrow = artifacts.require('EscrowMatic');
const RenderToken = artifacts.require('RenderTokenMatic');

const { loadAddressBook } = require('../utils/addressBookManager');

module.exports = async deployer => {
  try {
    accounts = await web3.eth.getAccounts();
    const owner = accounts[0]
    console.log("Script is running from:", owner)

    const networkId = await web3.eth.net.getId();
    let addressBook = loadAddressBook(networkId);
    let addresses = addressBook[networkId];

    let renderToken, escrow

    console.log("networkId:", networkId)

    // If the Escrow address is provided in the addressBook - use it. Otherwise - deploy a mock
    if (!addresses["EscrowMatic"] || !addresses["RenderTokenMatic"]) {
      console.log("No addresses found in the AddressBook - please check the addressBook or run truffle migrations and 2_fundMockMatic.js")
      console.log(addresses)
    } else {
      console.log("\nAddresses found:")
      console.log(addresses)
      console.log("\nLoading balances...")

      const csvJobIds = fs.readFileSync(path.join(__dirname, "../JobIdsWithBalances.csv"), { encoding: 'utf8' });
      const data = papaparse.parse(csvJobIds, { delimiter: ',', header: true, skipEmptyLines: true }).data
      const jobIds = data.map(item => item.jobId);
      const balances = data.map(item => item.balance);

      console.log("The following jobIds were found:")
      for (let i=0; i<jobIds.length; i++) {
        console.log(`${jobIds[i]}: ${fromWei(balances[i])} RNDR`)
      }

      console.log("Will be escrowing these to EscrowMatic...")

      renderToken = await RenderToken.at(addresses["RenderTokenMatic"])
      escrow = await Escrow.at(addresses["EscrowMatic"])
      
      for (let i=0; i<jobIds.length; i++) {
        existingBalance = await escrow.userBalance(jobIds[i]);
        if (existingBalance == 0) {
          console.log(`${jobIds[i]}: ${fromWei(balances[i])} RNDR - Escrowing...`)
          await renderToken.holdInEscrow(jobIds[i], balances[i])
        } else {
          console.log(`Balance already escrowed: ${jobIds[i]}: ${fromWei(balances[i])} RNDR - Skipping...`)
        }
      }
    }
  } catch(e) {
    console.log(e)
  }
  process.exit()
}