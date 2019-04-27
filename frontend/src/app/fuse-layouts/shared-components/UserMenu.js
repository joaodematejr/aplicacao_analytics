import { Avatar, Button, Icon, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class UserMenu extends Component {

    state = {
        userMenu: null
    };

    userMenuClick = event => {
        this.setState({ userMenu: event.currentTarget });
    };

    userMenuClose = () => {
        this.setState({ userMenu: null });
    };

    render() {
        return (
            <React.Fragment>
                <Button className="h-64" onClick={this.userMenuClick}>
                    <Avatar className="" alt="user photo" src={'http://www.mds.gov.br/webarquivos/arquivo/mds_pra_vc/botoes/Carta_de_Servi%C3%A7o__200x200_CIDADAO.png'} />
                    <div className="hidden md:flex flex-col ml-12 items-start">
                        <Typography component="span" className="normal-case font-600 flex">
                            Administrador
                        </Typography>
                        <Typography className="text-11 capitalize" color="textSecondary">
                            administrador
                        </Typography>
                    </div>
                    <Icon className="text-16 ml-12 hidden sm:flex" variant="action">keyboard_arrow_down</Icon>
                </Button>
            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

function mapStateToProps({ auth }) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
