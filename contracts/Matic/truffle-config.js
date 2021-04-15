const mainConfig = require('../../truffle-config');

module.exports = {
  networks: mainConfig.networks,
  mocha: mainConfig.mocha,
  contracts_directory: "./contracts/Matic",

  // Configure your compilers
  compilers: {
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
};
