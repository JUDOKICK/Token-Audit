# Render Token
The source code of the Render Token smart contract and the Escrow Contract.


## Instalation
`npm install`
Additionally, you will need to a file at the root of the project title 'config.js'
This file needs two exports - an Infura API key (titled infuraApiKey) and the mnemonic of an address (titled mnemonic) -- both exports should be strings
See config.example.js for formatting help


## Test
Ganache and Truffle are required for tests.

Run with:
`npm test`

or if you don't have bash (on Windows) do:
`truffle compile`
`truffle test`


**Airdrop contract is here:** https://github.com/jeualvarez/Token-Airdrop
