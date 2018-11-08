
/**
 * GatewayServer
 * @author Brian Dhang
 */
import { LocalAddress, CryptoUtils } from 'loom-js';
const privateKey = CryptoUtils.B64ToUint8Array('adXShr0HupvbEaXCQeXJINHhD+lpXBFt+Qkk+sYBJGHWaCYEDfEgrpFiRm53ffE50Rt+rHeCgPenzhYp5gsy7w==');
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);
const ownerAddress = LocalAddress.fromPublicKey(publicKey).toString();
console.log('OwnerAddress', ownerAddress);

const fs = require('fs');
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({ type: 'application/json' }));
const request = require('request-promise');

import ContractClient from './ContractClient';
const Web3 = require('web3');
const web3js = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/TOKEN"));
let TeneCoin, HrTest, Gateway;

const rate = 1000;
const modulus = 10 ** 18;
let solvedBlockNumber = Number(fs.readFileSync('./solvedBlockNumber', 'utf-8'));

import { BigNumber } from 'bignumber.js';

class GatewayServer {
  constructor() {
    this.initSideChain();
  }

  /**
   * Connect SideChain
   */
  async initSideChain() {
    const contract = new ContractClient();
    TeneCoin = contract.getContract('TeneCoin', privateKey);
    HrTest = contract.getContract('HrTest', privateKey);
    const tx1 = await TeneCoin.methods.name().call();

    if (tx1 === 'TeneCoin') {
      const TeneAddress = require(`./build/bin/TeneCoin`).address;
      const HrTestAddress = require(`./build/bin/HrTest`).address;
      await HrTest.methods.setTeneCoinAddress(TeneAddress).send();
      await TeneCoin.methods.grantAccessMint(HrTestAddress).send();

      await this.initGateway();
    }
  }


  /**
   * Connect Gateway
   */
  async initGateway() {
    let ABI;
    const contractAddress = "0x2981d917552395fc06cabb99cbc16444868188e8"
    await request(`http://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&format=raw`).then(res => {
      ABI = JSON.parse(res);
    });
    Gateway = new web3js.eth.Contract(ABI, contractAddress);
    this.createAPI();
  }

  /**
   * Create API
   */
  createAPI() {
    // Solve pass transaction
    Gateway.getPastEvents('allEvents', {
      fromBlock: solvedBlockNumber,
      toBlock: 'latest'
    }, async (err, events) => {
      if(!events) {
        return;
      }
      for (let i = 0; i < events.length; i++) {
        let event = events[i];

        if (event.event === 'Deposit') {
          await TeneCoin.methods.mint(event.returnValues.sideAddress, BigNumber(event.returnValues.ETH * rate).toString(10)).send();
          console.log('Deposit:', event.returnValues.mainAddress, event.returnValues.sideAddress, event.returnValues.ETH / modulus, 'ETH.');
        } else if (event.event === 'WithdrawReceived' || event.event === 'ForceWithdraw') {
          const oldTNC = await TeneCoin.methods.balanceOf(event.returnValues.sideAddress).call();
          await TeneCoin.methods.burnFrom(event.returnValues.sideAddress, BigNumber(oldTNC).toString(10)).send();
          console.log(event.event, event.returnValues.sideAddress, oldTNC, 'TNC');
        }

        solvedBlockNumber = event.blockNumber + 1;
      }
      fs.writeFileSync('./solvedBlockNumber', solvedBlockNumber, 'utf-8');

      // Solve future transaction
      this.deposit();
      this.withdraw();
    })
  }

  /**
   * Deposit
   */
  async deposit() {

    Gateway.getPastEvents('Deposit', {
      fromBlock: solvedBlockNumber,
      toBlock: 'latest'
    }, async (err, events) => {
      if (events) {
        for (let i = 0; i < events.length; i++) {
          let event = events[i];
          if (event.blockNumber > solvedBlockNumber) {
            try {
              await TeneCoin.methods.mint(event.returnValues.sideAddress, BigNumber(event.returnValues.ETH * rate).toString(10)).send();
              solvedBlockNumber = event.blockNumber + 1;
              console.log('Deposit:', event.returnValues.mainAddress, event.returnValues.sideAddress, event.returnValues.ETH / modulus, 'ETH.');
            } catch (error) {
              console.log(error);
            }
          }
        }
        fs.writeFileSync('./solvedBlockNumber', solvedBlockNumber, 'utf-8');
      }
      setTimeout(() => {
        this.deposit();
      }, 3000)
    })
  }

  /**
   * Withdraw
   */
  withdraw() {
    app.post('/withdraw', async (req, res) => {
      const mainAddress = req.body.mainAddress;
      const sideAddress = req.body.sideAddress;

      const queryId = await Gateway.methods.userLastQuery(mainAddress).call();
      const queryToStatus = await Gateway.methods.queryToStatus(queryId).call();

      // Check valid sideChain to mainChain, prevent another user call withdraw to sideChain account
      if ((await TeneCoin.methods.sideAddressToMainAddress(sideAddress).call()).toLowerCase() === mainAddress) {
        const oldTNC = BigNumber(await TeneCoin.methods.balanceOf(sideAddress).call()).toString(10);

        if (queryToStatus === "1" && oldTNC > 0) {
          await TeneCoin.methods.burnFrom(sideAddress, BigNumber(oldTNC).toString(10)).send();
          console.log('Withdraw:', sideAddress, oldTNC, 'TNC');
          res.status(200).send(oldTNC);
        } else {
          console.log("Query not allowed with status:", queryToStatus, "Old TNC:", oldTNC);
          res.status(200).send("0");
        }
      } else {
        res.status(200).send("0");
      }
    });
  }
}
new GatewayServer();

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("GatewayServer listening at http://%s:%s", host, port)
})
