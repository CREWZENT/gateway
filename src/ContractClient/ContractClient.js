
import { Client, LocalAddress, CryptoUtils, LoomProvider } from 'loom-js';

import Web3 from 'web3';

// Required ip
let { localhost } = require('./getip.json');
switch (localhost) {
  case '10.148.0.2':
    localhost = "35.186.156.17";
    break;
  case '10.148.0.4':
    localhost = "35.240.141.4";
    break;
  case '10.148.0.3':
    localhost = "35.240.249.169";
    break;
  case '10.148.0.5':
    localhost = "35.240.249.243";
    break;
  default:
    break;
}

export default class ContractClient {

  async generatePrivateKey(user) {
    let privateKey = CryptoUtils.generatePrivateKey();
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);
    const from = LocalAddress.fromPublicKey(publicKey).toString();

    return { privateKey: CryptoUtils.Uint8ArrayToB64(privateKey), address: from };
  }

  getContract(contractName, privateKeyText) {
    const client = new Client(
      'default',
      `ws://${localhost}:46657/websocket`,
      `ws://${localhost}:9999/queryws`
    )
    const privateKey = CryptoUtils.B64ToUint8Array(privateKeyText);
    const loomProvider = new LoomProvider(client, privateKey);
    const web3 = new Web3(loomProvider);
    
    const deployData = require(`../dappchain/build/bin/${contractName}`); // Point to deployed contract
    const ABI = deployData.abi;
    const contractAddress = deployData.address;

    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);
    const from = LocalAddress.fromPublicKey(publicKey).toString();
    const contract = new web3.eth.Contract(ABI, contractAddress, { from });
    return contract;
  }
}