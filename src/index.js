import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from './FirebaseConfig';

import './assets/css/index.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import store from './redux.store';
import ContractClient from './ContractClient/ContractClient';

import Loadable from 'react-loadable';
import Loading from './Components/Loading';

const db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

const Gateway = Loadable({
    loader: () => import('./Components/Gateway'),
    loading: Loading
});

const Menu = Loadable({
  loader: () => import('./Components/Menu'),
  loading: Loading
});

const Templates = Loadable({
  loader: () => import('./Components/Templates'),
  loading: Loading
});

const Board = Loadable({
  loader: () => import('./Components/Board'),
  loading: Loading
});

const Playing = Loadable({
  loader: () => import('./Components/Playing'),
  loading: Loading
});

const JoinRoom = Loadable({
  loader: () => import('./Components/JoinRoom'),
  loading: Loading
});

var Web3 = require('web3');


const web3 = window.web3;
let web3js;
let mainAddress;
class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: 0
    }

    this.onAuthStateChanged = this.onAuthStateChanged.bind(this);
    this.onMetaMaskChanged = this.onMetaMaskChanged.bind(this);

    this.saveUserPrivateKey = this.saveUserPrivateKey.bind(this);
    this.saveUserMainAddress = this.saveUserMainAddress.bind(this);

    this.initSideChain = this.initSideChain.bind(this);
    this.initGateway = this.initGateway.bind(this);

    this.getTNCBalance = this.getTNCBalance.bind(this);
  }

  componentDidMount() {

    this.onAuthStateChanged();
  }

  /**
   * SideChain step 1
   */
  onAuthStateChanged() {
    const { state, dispatch } = this.props;

    // Get login session
    firebase.auth().onAuthStateChanged((auth) => {
      if (auth) {
        let user = auth.providerData[0];
        user = { ...user, fbid: user.uid, uid: auth.uid };
        // Get user from database firestore
        db.collection('usersPrivate').doc(user.uid).get().then(doc => {
          let userData = user;
          if (doc.exists) {
            userData = doc.data();
          } else {
            db.collection('users').doc(user.uid).set(user); // Save user to database if not exists
            db.collection('usersPrivate').doc(user.uid).set(user); // Save user to database if not exists
          }
          dispatch({ type: 'changeUser', data: { ...state.user, ...userData } });
          this.saveUserPrivateKey();
        });
      } else {
        dispatch({ type: 'changeUser', data: false });
      }
    });
  }

  /**
   * SideChain step 2
   */
  async saveUserPrivateKey() {
    const { state, dispatch } = this.props;

    let sideData;
    if (state.user.privateKey) {
      sideData = { privateKey: state.user.privateKey, address: state.user.address };
    } else {
      const contract = new ContractClient();
      sideData = await contract.generatePrivateKey(state.user);

      // Public data
      db.collection('users').doc(state.user.uid).update({
        address: sideData.address,
      }).then(_ => {
        console.log("Saved main address for user", sideData.address);
      });
      // Private data
      db.collection('usersPrivate').doc(state.user.uid).update({
        address: sideData.address,
        privateKey: sideData.privateKey,
      }).then(_ => {
        console.log("Saved private key for user", sideData.privateKey);
      })
    }

    dispatch({ type: 'changeUser', data: { ...state.user, privateKey: sideData.privateKey, address: sideData.address, mainAddress } });

    this.initSideChain(sideData.privateKey);
  }


  /**
   * SideChain step 3
   * Init side chain
   */
  initSideChain(privateKey) {
    const { state, dispatch } = this.props;
    const TeneAddress = require(`./dappchain/build/bin/TeneCoin`).address;
    const HrTestAddress = require(`./dappchain/build/bin/HrTest`).address;
    dispatch({ type: 'TeneAddress', data: TeneAddress });
    dispatch({ type: 'HrTestAddress', data: HrTestAddress });

    const contract = new ContractClient();
    const TeneCoin = contract.getContract('TeneCoin', privateKey);
    const HrTest = contract.getContract('HrTest', privateKey);
    dispatch({ type: 'TeneCoin', data: TeneCoin });
    dispatch({ type: 'HrTest', data: HrTest });

    this.getTNCBalance();

    TeneCoin.events.Transfer({}, (err, event) => {
      if (event.returnValues.to.toLowerCase() === state.user.address || event.returnValues.from.toLowerCase() === state.user.address) {
        this.getTNCBalance();
      }
    })

    this.onMetaMaskChanged(); // Start Connect MainChain MetaMask
  }

  /**
   * SideChain step 4
   * Get sidechain data
   */
  async getTNCBalance() {
    const { state, dispatch } = this.props;
    const rawBalance = await state.TeneCoin.methods.balanceOf(state.user.address).call();
    const balance = rawBalance / (10 ** 18);
    dispatch({ type: 'setBalance', data: balance });
  }

  /**
   * MainChain step 1
   * mainAddress value:
   * 0: not support browsers
   * 1: not installed Metamask
   * 2: not logged in Metamask
   * 3: not correct network
   */
  onMetaMaskChanged() {
    const { state, dispatch } = this.props;
    // const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isChrome = true;
    if (isChrome) {
      if (typeof web3 !== 'undefined') {
        web3js = new Web3(web3.currentProvider);
        setInterval(() => {
          web3js.eth.getAccounts((err, accounts) => {
            if (!accounts[0]) {
              mainAddress = accounts[0];
              dispatch({ type: 'changeUser', data: { ...state.user, mainAddress: 2 } });
            }
            if (accounts[0] && accounts[0] !== mainAddress) {
              mainAddress = accounts[0];
              this.saveUserMainAddress();
              web3js.eth.net.getNetworkType((err, netId) => {
                if (netId === 'ropsten') {
                  dispatch({ type: 'changeUser', data: { ...state.user, mainAddress } });
                } else {
                  dispatch({ type: 'changeUser', data: { ...state.user, mainAddress: 3 } });
                }
              });
            }
          });
        }, 1000);
      } else {
        dispatch({ type: 'changeUser', data: { ...state.user, mainAddress: 1 } });
      }

    } else {
      // Handle not support browsers
      dispatch({ type: 'changeUser', data: { ...state.user, mainAddress: 0 } });
    }

  }

  /**
   * MainChain step 2
   */
  async saveUserMainAddress() {
    const { state } = this.props;
    if (mainAddress !== state.user.mainAddress) {
      // Set MainChain Address
      await state.TeneCoin.methods.setMainAddress(mainAddress).send();

      // Public data
      db.collection('users').doc(state.user.uid).update({
        mainAddress
      }).then(_ => {
        // console.log("Saved main address for user", mainAddress);
      })

      // Private data
      db.collection('usersPrivate').doc(state.user.uid).update({
        mainAddress,
      }).then(_ => {
        // console.log("Saved main address for user", mainAddress);
      })
    }
    this.initGateway();
  }

  /**
   * MainChain step 3
   * Init gateway
   */
  async initGateway() {
    const { dispatch } = this.props;

    let ABI;
    const contractAddress = "0x2981d917552395fc06cabb99cbc16444868188e8"
    await fetch(`http://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&format=raw`)
      .then(res => res.json())
      .then(res => {
        ABI = res;
      })
    const Gateway = new web3js.eth.Contract(ABI, contractAddress);

    dispatch({ 'type': 'Gateway', data: Gateway });
  }

  render() {
    const { state } = this.props;
    return (
      <Router>
        <div className="full-header">
          <Menu />

          {
            !state.user && state.user !== false &&
            <div className="row">
              <div className="text-center mt-5 mx-auto">
                <div className="loader"></div>
              </div>
            </div>
          }

          <Switch>

            {
              state.user && state.user.mainAddress && state.user.mainAddress.toString().length > 1 &&
              <Route path="/gateway" component={Gateway} />
            }

            {
              state.user && state.user.mainAddress && state.user.mainAddress.toString().length > 1 &&
              <Route path="/templates" component={Templates} />
            }

            {
              state.user && state.user.mainAddress && state.user.mainAddress.toString().length > 1 &&
              <Route path="/board/:quizId" component={Board} />
            }
            {
              state.user && state.user.mainAddress && state.user.mainAddress.toString().length > 1 &&
              <Route path="/playing/:quizId" component={Playing} />
            }
            {
              ((state.user && state.user.mainAddress !== undefined) || state.user === false) &&
              <Route key="0" component={JoinRoom} />
            }
          </Switch>
        </div>
      </Router>
    );
  }
}

Root = connect(
  (state) => {
    return { state };
  },
  (dispatch) => {
    return { dispatch };
  },
)(Root);

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>
  , document.getElementById('root'));

