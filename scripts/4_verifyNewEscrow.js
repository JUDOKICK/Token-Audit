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

      console.log("Verifying EscrowMatic to match these balances...")

      renderToken = await RenderToken.at(addresses["RenderTokenMatic"])
      escrow = await Escrow.at(addresses["EscrowMatic"])
      
      let matching = [`jobId,balance`]
      let notMatching = [`jobId,balance`]

      for (let i=0; i<jobIds.length; i++) {
        onChainBalance = await escrow.userBalance(jobIds[i]);

        if (onChainBalance.toString() == balances[i].toString()) {
          console.log(`${jobIds[i]}: ${fromWei(onChainBalance)} RNDR - OK!`)
          matching.push(`${jobIds[i]},${balances[i].toString()}`)
        } else {
          console.log(`Doesn't match: ${jobIds[i]}: ${fromWei(onChainBalance)} RNDR (should be: ${fromWei(balances[i])})`)
          notMatching.push(`${jobIds[i]},${balances[i].toString()}`)
        }
      }

      fs.writeFileSync(path.join(__dirname, `../MaticEscrowBalances.csv`), matching.join('\n'));
      fs.writeFileSync(path.join(__dirname, `../MaticEscrowNotMatchingBalances.csv`), notMatching.join('\n'));
    }
  } catch(e) {
    console.log(e)
  }
  process.exit()
}