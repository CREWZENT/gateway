const { readFileSync } = require('fs');
const LoomTruffleProvider = require('loom-truffle-provider');

const chainId    = 'default'
const writeUrl   = 'http://localhost:46658/rpc'
const readUrl    = 'http://localhost:46658/query'

const privateKey = readFileSync('./private_key', 'utf-8');

const loomTruffleProvider = new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
loomTruffleProvider.createExtraAccounts(10)

module.exports = {
  networks: {
    loom_dapp_chain: {
      provider: loomTruffleProvider,
      network_id: '*',
      gas: 0
    }
  }
}
