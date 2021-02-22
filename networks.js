
const { projectId, mnemonic,mnemonicLedger, mnemonicGanache } = require('./secrets.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      protocol: 'http',
      host: 'localhost',
      port: 7545,
      gas: 6721975,
      gasPrice: 5e9,
      networkId: '*',
    },
    maticMumbai: {
      provider: () => new HDWalletProvider(
        mnemonic, 'https://rpc-mumbai.maticvigil.com/'
        , 0, 10),
      networkId: 80001,
      gasPrice: 2e9,
      gas: 10000000

    },
	maticMainnet: {
      provider: () => new HDWalletProvider(
        mnemonic, 'https://rpc-mainnet.matic.network/'
        , 0, 10),
      networkId: 137,
      gasPrice: 4e9,
      gas: 10000000

    },
    rinkeby: {
      provider: () => new HDWalletProvider(
        mnemonic, `https://rinkeby.infura.io/v3/${projectId}`
        ,0 , 10),
      networkId: 4,
      gasPrice: 10e9,
	    gas: 10000000
    },
	gorli: {
      provider: () => new HDWalletProvider(
        mnemonic, `https://goerli.infura.io/v3/${projectId}`
        ,0 , 10),
      networkId: 5,
      gasPrice: 30e9,
	    gas: 8000000
    },
	   ropsten: {
      provider: () => new HDWalletProvider(
        mnemonic, `https://ropsten.infura.io/v3/${projectId}`
         ,0, 10),
      networkId: 3,
      gasPrice: 10e9
    },
    	mainnet: {
      provider: () => new HDWalletProvider(
        mnemonic, `https://mainnet.infura.io/v3/${projectId}`
        ,0 , 10),
      networkId: 1,
      gasPrice: 13e9,
    }
  },
}
