const mainConfig = require('../../truffle-config');

module.exports = {
  networks: mainConfig.networks,
  mocha: mainConfig.mocha,
  contracts_directory: "./contracts/Legacy",

  // Configure your compilers
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
  },
};
