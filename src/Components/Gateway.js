/**
 * Market
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import firebase from '../FirebaseConfig';

const db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

const modulus = 10 ** 18;

class DefaultName extends Component {

  constructor(props) {
    super(props);
    this.state = {
      histories: []
    }

    this.deposit = this.deposit.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.getHistory = this.getHistory.bind(this);
  }

  componentDidMount() {
    this.getHistory();

  }

  async getHistory() {
    const { state } = this.props;
    if (!state.Gateway) {
      setTimeout(() => {
        this.getHistory();
      }, 1000);
      return;
    }

    const histories = [];

    state.Gateway.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest'
    }, async (err, txs) => {
      if (txs) {
        for (let i = 0; i < txs.length; i++) {
          let tx = txs[i];
          if (tx.event === 'Deposit' || tx.event === 'WithdrawReceived') {
            new Promise((resolve, reject) => {
              db.collection('users').where("address", "==", tx.returnValues.sideAddress.toLowerCase()).limit(1).get().then((querySnapshot) => {
                if (!querySnapshot.length) {
                  resolve();
                }
                querySnapshot.forEach(async (doc) => {
                  tx.user = doc.data();
                  histories.push(tx);
                  this.setState({ histories })
                  resolve();
                })
              })
            })
          }
        }

      }
    })

  }

  async deposit() {
    const { state } = this.props;

    var depositValue = prompt("Please enter the ETH value to deposit", 0.01);

    if (Number(depositValue) >= 0.01) {
      try {
        await state.Gateway.methods.deposit(state.user.address, depositValue * modulus).send({
          from: state.user.mainAddress,
          value: depositValue * modulus,
          gasPrice: 210000000,
          // gas: '300000',
        });
      } catch (error) {
        alert(error);
      }
    }
  }

  async withdraw() {
    const { state } = this.props;

    try {
      await state.Gateway.methods.withdraw(state.user.address).send({
        from: state.user.mainAddress,
        value: 0.0003135 * modulus,
        gasPrice: 210000000,
        gas: '300000',
      });
    } catch (error) {
      console.log(error);
    }
  }

  async forceWithdraw() {
    const { state } = this.props;

    try {
      await state.Gateway.methods.forceWithdraw().send({
        from: state.user.mainAddress,
        value: 0,
        gasPrice: 210000000,
        // gas: '300000',
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { state } = this.props;
    const { histories } = this.state;
    return (
      <div className="gateway">
        {
          state.Gateway &&
          <div className="container">
            <div className="row">

              <div className="col-md-12 text-center">
                <h1 className="mt-3"><b>Transfer Gateway</b></h1>
                <div>
                  <a className="btn btn-info my-2 mx-2" href="https://faucet.metamask.io/" rel="noopener noreferrer" target="_blank">Get Free ETH</a>
                </div>
                <button className="btn btn-outline-success my-2 mx-2" onClick={this.deposit}>Deposit ETH</button>
                <button className="btn btn-outline-warning my-2 mx-2" onClick={this.withdraw}>Withdraw ETH</button>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="mt-5"><b>Transfer History</b></h1>
                <div id="accordion">

                  {
                    histories.map((tx, i) => {
                      return (
                        <div key={i} className="card historyCard">
                          <div className="card-header" id={"headingThree"}>
                            <h5 className="mb-0 text-left">
                              <img className="profile" src={tx.user.photoURL} alt="" />
                              <button className="btn btn-link collapsed" data-toggle="collapse" data-target={`#collapse${i}`} aria-expanded="false" aria-controls="collapseThree">
                                <small><b>{tx.user.displayName}</b> {tx.event === 'Deposit' ? 'deposit' : 'withdraw'} {tx.returnValues.ETH / 10 ** 18} ETH</small>
                              </button>
                            </h5>
                          </div>
                          <div id={`collapse${i}`} className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                            <div className="card-body">
                              <table className="historyDetail">
                                <tbody className="text-left">
                                  <tr>
                                    <td>User Address</td>
                                    <td className="pl-2"><a href={`https://ropsten.etherscan.io/address/${tx.returnValues.mainAddress}`} target="_blank">{tx.returnValues.mainAddress.toLowerCase()}</a></td>
                                  </tr>
                                  <tr>
                                    <td>Contract Address</td>
                                    <td className="pl-2"><a href={`https://ropsten.etherscan.io/address/${tx.address}`} target="_blank">{tx.address}</a></td>
                                  </tr>
                                  <tr>
                                    <td>Block Hash</td>
                                    <td className="pl-2">{tx.blockHash}</td>
                                  </tr>
                                  <tr>
                                    <td>Block Number</td>
                                    <td className="pl-2">{tx.blockNumber}</td>
                                  </tr>
                                  <tr>
                                    <td>Event</td>
                                    <td className="pl-2">{tx.event}</td>
                                  </tr>
                                  <tr>
                                    <td>Value</td>
                                    <td className="pl-2">{tx.returnValues.ETH / 10 ** 18} ETH</td>
                                  </tr>
                                  <tr>
                                    <td>Signature</td>
                                    <td className="pl-2">{tx.signature}</td>
                                  </tr>
                                  <tr>
                                    <td>Transaction Hash</td>
                                    <td className="pl-2"><a href={`https://ropsten.etherscan.io/tx/${tx.transactionHash}`} target="_blank">{tx.transactionHash}</a></td>
                                  </tr>
                                  <tr>
                                    <td>Transaction Index</td>
                                    <td className="pl-2">{tx.transactionIndex}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  }


                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default DefaultName = connect(
  (state) => {
    return { state };
  },
  (dispatch) => {
    return { dispatch };
  },
)(DefaultName);