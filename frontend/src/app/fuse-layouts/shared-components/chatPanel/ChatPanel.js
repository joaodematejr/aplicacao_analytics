import { withStyles } from '@material-ui/core';
import withReducer from 'app/store/withReducer';
import keycode from 'keycode';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from './store/actions';
import reducer from './store/reducers';

const styles = theme => ({
    root: {
        width: 70,
        maxWidth: 70,
        minWidth: 70,
        [theme.breakpoints.down('md')]: {
            width: 0,
            maxWidth: 0,
            minWidth: 0
        }
    },
    panel: {
        position: 'absolute',
        width: 360,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
        top: 0,
        height: '100%',
        minHeight: '100%',
        bottom: 0,
        right: 0,
        margin: 0,
        zIndex: 1000,
        transform: 'translate3d(290px,0,0)',
        overflow: 'hidden',
        [theme.breakpoints.down('md')]: {
            transform: 'translate3d(360px,0,0)',
            boxShadow: 'none',
            '&.opened': {
                boxShadow: theme.shadows[5]
            }
        },
        transition: theme.transitions.create(['transform'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard
        }),
        '&.opened': {
            transform: 'translateX(0)'
        }
    }
});

class ChatPanel extends Component {

    componentDidMount() {
        this.props.getUserData();
        this.props.getContacts();
    }

    componentDidUpdate(prevProps) {
        if (this.props.state !== prevProps.state) {
            if (this.props.state) {
                document.addEventListener("keydown", this.handleDocumentKeyDown);
            }
            else {
                document.removeEventListener('keydown', this.handleDocumentKeyDown);
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
    }

    handleDocumentKeyDown = event => {
        if (keycode(event) === 'esc') {
            this.props.closeChatPanel();
        }
    };

    render() {
        return (
            <div />
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUserData: Actions.getUserData,
        getContacts: Actions.getContacts,
        openChatPanel: Actions.openChatPanel,
        closeChatPanel: Actions.closeChatPanel
    }, dispatch);
}

function mapStateToProps({ chatPanel }) {
    return {
        contacts: chatPanel.contacts.entities,
        selectedContactId: chatPanel.contacts.selectedContactId,
        state: chatPanel.state
    }
}

export default withReducer('chatPanel', reducer)(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChatPanel)));
