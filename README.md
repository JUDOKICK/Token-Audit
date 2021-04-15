# Compile Legacy and Matic contracts

1. `truffle compile --config contracts/Legacy/truffle-config.js --all`

2. `truffle compile --config contracts/Matic/truffle-config.js --all`

# When running Tests or Migrations - use --compiler=none flag, to use existing artifacts

1. `truffle migrate --reset --compiler=none`

2. `truffle test --compiler=none`

# To avoid OpenZeppelin Upgrades complaining about upgradeable contract having a constructor:

  1. Edit this file:
  
    `node_modules/@openzeppelin/upgrades-core/dist/validate/run.js`

  2. Comment line 42:

    `// ...getConstructorErrors(contractDef, decodeSrc),`

  3. Write a message to OpenZeppelin to disable this behaviour.

# Escrow L1->L2 migration

0. Run `npm install`

1. Put jobIds in the `jobIds.csv` file

2. Put credentials in `config.js` (based on `config.example.js`)

3. Check the `addressBook.json` for the correct contract addresses

4. If you're testing it on testnet or local machine, run:

    `truffle exec scripts/0_deployMocks.js --network kovan`

    In case there are no addresses in the `addressBook.json` for the specified network - the MOCK contracts will be created and filled with MOCK jobs and tokens

5. Make sure you input the `TargetAddress` in the `addressBook.json` for the needed network - that's the address to where the tokens will be sent from `Escrow`

6. Specify the desired gas price (in wei) in `truffle-config.js` for the chosen network

7. To perform the actual migration run (specifying the network needed: `mainnet`/`kovan`/`ropsten`/`development`):

    `truffle exec scripts/1_fetchFundsFromEscrow.js --network kovan`

This will first fetch all the `jobId` balances and save them in `JobIdsWithBalances.csv` - for future reference.
And then it will try to disburse RNDR from each `jobId` to the `TargetAddress` in separate transactions.

If something goes wrong (not high enough gas price or Infura error) - you can run the step 7 again and if will skip the `jobId`'s that have already been disbursed and have `0` balance.

After all the tokens are on the `TargetAddress` (which should be a multisig or Ledger account - well protected) - you can transfer them to the Matic L2 chain using their PoS Bridge - to a similar single address - that will be used as a disbursor to load them up to Matic L2 Escrow using the Stage 2 script.

# L2 Escrowing of Matic tokens

0. For testing run:

    `truffle migrate --reset --compiler=none`

    then

    `truffle exec scripts/2_fundMockMatic.js --network development --compiler=none`

1. For the real thing - you need to run the L1->L2 part above first - because you need to have `JobIdsWithBalances.csv` file ready with all the jobIds and balances

2. To push all balances to userIds of new EscrowMatic run:

    `truffle exec scripts/3_pushToNewEscrow.js --network development --compiler=none`

    It will automatically check if the balance already exists, and skips if it does. So you can run it many times if it fails - it will continue where it stopped

3. To verify if everything went smoothly and balances had been escrowed correctly run:

    `truffle exec scripts/4_verifyNewEscrow.js --network development --compiler=none`

    It will compare all onChain balances to the ones from `JobIdsWithBalances.csv` and output two files:

    `MaticEscrowBalances.csv` - with onChainBalances

    `MaticEscrowNotMatchingBalances.csv` - with any of the balances that do not match