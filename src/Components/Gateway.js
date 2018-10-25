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
    this.deposit = this.deposit.bind(this);
    this.withdraw = this.withdraw.bind(this);
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
    return (
      <div>
        {
          state.Gateway &&
          <div>
            <button className="btn btn-success my-2 mx-2" onClick={this.deposit}>Deposit & Withdraw ETH</button>
            {/* <button className="btn btn-outline-info my-2 mx-2" onClick={this.withdraw}>Withdraw ETH</button> */}
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