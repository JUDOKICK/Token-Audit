
const HDWalletProvider = require("truffle-hdwallet-provider");
const infuraApiKey = require('./secrets').projectId;
const mnemonic = require('./secrets').mnemonic;

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 7545,
      network_id: '5777'
    },
    local: {
      host: 'localhost',
      port: 9545,
      network_id: '*'
    },
    ropsten:  {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraApiKey}`),
      network_id: 3
    },
	goerli:  {
      provider: () => new HDWalletProvider(mnemonic, `https://goerli.infura.io/${infuraApiKey}`),
      network_id: 5
    },
	matic: {
      provider: () => new HDWalletProvider(
        mnemonic, 'https://rpc-mumbai.maticvigil.com/'
        , 0, 10),
      network_id: 80001
    },
	mumbai: {
      provider: () => new HDWalletProvider(
        mnemonic, 'https://rpc-mainnet.matic.network/'
        , 0, 10),
      network_id: 137
    },
	mainnet: {
      provider: () => new HDWalletProvider(
        mnemonic, `https://mainnet.infura.io/v3/${projectId}`
        ,0 , 10),
      network_id: 1
    }
	
  },
  compilers: {
    solc: {
      version: "0.4.24",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        optimizer: {
          enabled: true,
          runs: 1000,   // Optimize for how many times you intend to run the code
          }
      }
    },
    solc: {
      version: "0.7.6",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        optimizer: {
          enabled: true,
          runs: 9999,// Optimize for how many times you intend to run the code
        }
      }
    }
  },
  compilers: {
    solc: {
      version: "0.7.6",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        optimizer: {
          enabled: true,
          runs: 9999,   // Optimize for how many times you intend to run the code
          }
      }
    }
  }

};
