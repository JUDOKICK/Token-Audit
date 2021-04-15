const HDWalletProvider = require("@truffle/hdwallet-provider");
const infuraApiKey = require('./secrets').infuraApiKey;
const mnemonic = require('./secrets').mnemonic;
const privateKey = require('./secrets').privateKey;

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
    mainnet: {
      provider: () => new HDWalletProvider({privateKeys: [privateKey],
          providerOrUrl: `https://kovan.infura.io/v3/${infuraApiKey}`}),
      gasPrice: 50000000000,
      network_id: 42
    },
    kovan: {
      provider: () => new HDWalletProvider({privateKeys: [privateKey],
          providerOrUrl: `https://kovan.infura.io/v3/${infuraApiKey}`}),
      gasPrice: 50000000000,
      network_id: 42
    },
    ropsten:  {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraApiKey}`),
      network_id: 3
    },
	goerli:  {
      provider: () => new HDWalletProvider(mnemonic, `https://goerli.infura.io/${infuraApiKey}`),
      network_id: 5
    },
	mumbai: {
      provider: () => new HDWalletProvider(
        mnemonic, 'https://rpc-mumbai.maticvigil.com/'
        , 0, 10),
      network_id: 80001
    },
	matic: {
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
	
  }
};
