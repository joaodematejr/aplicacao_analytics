import React, { Component } from 'react';
import { FuseSplashScreen } from '@fuse';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import * as Actions from 'app/store/actions';

class Callback extends Component {

    render() {
        return (
            <FuseSplashScreen />
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        showMessage: Actions.showMessage,
        hideMessage: Actions.hideMessage
    },
        dispatch);
}

export default withRouter(connect(null, mapDispatchToProps)(Callback));
