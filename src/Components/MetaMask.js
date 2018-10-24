import React, { Component } from 'react';
import { connect } from 'react-redux';


class DefaultName extends Component {

    componentDidMount() {

    }

    render() {
        const { state } = this.props;
        return (
            <div className="row mt-3">
                <div className="col-sm-3"></div>
                <div className="col-sm-6">

                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title">MetaMask TestNet Requirement</h3>
                            <hr/>

                            {
                                state.user.mainAddress === 0 &&
                                <div>
                                    <h5 className="font-weight-bold">Oops, you’re on the wrong browser</h5>
                                    <p className="mb-0">Try to use browsers support Dapps games like Chrome, Firefox on desktop or <b>Cipher</b> on mobile</p>
                                </div>
                            }
                            {
                                state.user.mainAddress === 1 &&
                                <div>
                                    <h5 className="font-weight-bold">Oops, you’re not installed MetaMask</h5>
                                    <p className="mb-0">Please install
                                        <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" target="_blank" rel="noopener noreferrer"> MetaMask </a>
                                        for desktop or using <b>Cipher</b> browser for mobile devices.
                                    </p>
                                    <div>
                                        <a href="https://itunes.apple.com/app/cipher-browser-for-ethereum/id1294572970?ls=1&amp;mt=8">
                                            <img src="https://www.cipherbrowser.com/images/app-store.svg" className="mr-2" alt="Download on the Apple App Store" />
                                        </a>
                                        <a href="https://play.google.com/store/apps/details?id=com.cipherbrowser.cipher">
                                            <img src="https://www.cipherbrowser.com/images/google-play.svg" alt="Get it on Google Play" />
                                        </a>
                                    </div>
                                </div>
                            }
                            {
                                state.user.mainAddress === 2 &&
                                <div>
                                    <h5 className="font-weight-bold">Oops, your MetaMask is locked</h5>
                                    <p className="mb-0">Simply open
                            <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" target="_blank" rel="noopener noreferrer"> MetaMask </a>
                                        and follow the instructions to unlock it.
                        </p>
                                </div>
                            }
                            {
                                state.user.mainAddress === 3 &&
                                <div>
                                    <h5 className="font-weight-bold mb-2">Oops, you’re on the wrong network</h5>
                                    <p>Simply open MetaMask and switch over to the <b>Ropsten Test Network.</b></p>
                                    {/* <img src={require(`../assets/img/landingpage/main-network.png`)} height="230" alt="Ropsten Test Network" /> */}
                                </div>
                            }

                        </div>
                    </div>
                <div className="col-sm-3"></div>

                </div>

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