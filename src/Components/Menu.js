import React, { Component } from 'react';

import firebase from '../FirebaseConfig';
import { connect } from 'react-redux';

import Loadable from 'react-loadable';
import Loading from './Loading';

const Gateway = Loadable({
    loader: () => import('./Gateway'),
    loading: Loading
});

// import { Link } from 'react-router-dom';

class DefaultName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: '',
        }

        this.signOut = this.signOut.bind(this);
    }

    /**
     * SignIn
     */
    signIn() {
        const provider = new firebase.auth.FacebookAuthProvider();
        return firebase.auth().signInWithRedirect(provider).then().catch((error) => {
            console.log(error.message);
        });
    }

    signOut() {
        firebase.auth().signOut().then(() => {
            window.location.reload();
        }).catch((error) => {
            console.log(error);
        });
    }

    /**
     * Get TNC balance
     */
    async getTNCBalance() {
        const { state, dispatch } = this.props;
        const rawBalance = await state.TeneCoin.methods.balanceOf(state.user.address).call();
        const balance = rawBalance / (10 ** 18);
        dispatch({ type: 'setBalance', data: balance });
    }

    render() {
        const { state } = this.props;
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bd-navbar">
                    <a className="navbar-brand" href="/">
                        <img src="https://getbootstrap.com/docs/4.1/assets/brand/bootstrap-solid.svg" width="30" height="30" className="d-inline-block align-top mx-1" alt="" />
                    </a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarColor01">
                        <ul className="navbar-nav mr-auto">
                            <li className={"nav-item" + (window.location.pathname === "/" ? " active" : "")}>
                                <a className="nav-link" href="/">Join</a>
                            </li>
                            <li className={"nav-item" + (window.location.pathname.indexOf('/create') !== -1 ? " active" : "")}>
                                <a className="nav-link" href="/create">Create</a>
                            </li>
                        </ul>
                        {
                            state.user && state.user.mainAddress && state.user.mainAddress.toString().length > 1 &&
                            <Gateway />
                        }
                        {
                            state.user === false &&
                            <button className="btn btn-primary my-2 mx-2" onClick={this.signIn}>Facebook Login</button>
                        }
                        {
                            state.user && state.user !== false &&
                            <button className="btn btn-primary my-2 mx-2" onClick={this.signOut}>Facebook Logout</button>
                        }

                    </div>
                </nav>
            </div >
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