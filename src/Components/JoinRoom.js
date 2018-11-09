import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../FirebaseConfig';


import Loadable from 'react-loadable';
import Loading from './Loading';

const MetaMask = Loadable({
    loader: () => import('./MetaMask'),
    loading: Loading
});

class DefaultName extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quizId: 0
        }

        this.changeQuizId = this.changeQuizId.bind(this);
        this.joinQuiz = this.joinQuiz.bind(this);
    }

    componentDidMount() {

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
            this.getTNCBalance();
        }).catch((error) => {
            console.log(error);
        });
    }


    changeQuizId(e) {
        this.setState({ quizId: e.target.value });
    }

    async joinQuiz() {
        const { state } = this.props;
        const tx = await state.HrTest.methods.joinQuiz(
            this.state.quizId
        ).send();
        if (tx.blockHash) {
            console.log(tx);
            window.location = `/playing/${this.state.quizId}`;
        }
    }

    render() {
        const { state } = this.props;
        return (
            <div className="joinRoom">
                {
                    (state.user.mainAddress === 0 || state.user.mainAddress === 1 || state.user.mainAddress === 2 || state.user.mainAddress === 3) &&
                    <MetaMask />
                }
                {
                    state.user === false &&
                    <div className="row mt-3">
                        <div className="col-sm-3"></div>
                        <div className="col-sm-6">
                            <div className="card">
                                <div className="card-body">
                                    <h3 className="card-title">Facebook Login Requirement</h3>
                                    <hr />
                                    You haven't logged in.
                                    <div>
                                        <button className="btn btn-primary" onClick={this.signIn}>Facebook Login</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3"></div>
                    </div>
                }
                {
                    (state.user.mainAddress && state.user.mainAddress.toString().length > 1) &&
                    <div className='join-room-div'>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <label>Enter PIN</label>
                                <input type="number" className="form-control" placeholder="Quiz Id..." value={this.state.quizId} onChange={this.changeQuizId} />
                                <button className="btn-join-quiz" onClick={() => this.joinQuiz()}>Enter</button>
                            </div>
                        </form>
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