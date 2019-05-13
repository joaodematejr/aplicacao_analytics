import React from 'react';
import { AppBar, Avatar, Typography, withStyles } from '@material-ui/core';
import connect from 'react-redux/es/connect/connect';
import classNames from 'classnames';

const styles = theme => ({
    root: {
        '& .user': {
            '& .username, & .email': {
                transition: theme.transitions.create('opacity', {
                    duration: theme.transitions.duration.shortest,
                    easing: theme.transitions.easing.easeInOut
                })
            }
        }
    },
    avatar: {
        width: 72,
        height: 72,
        position: 'absolute',
        top: 92,
        padding: 8,
        background: theme.palette.background.default,
        boxSizing: 'content-box',
        left: '50%',
        transform: 'translateX(-50%)',
        '& > img': {
            borderRadius: '50%'
        }
    }
});

const UserNavbarHeader = ({ user, classes }) => {
    return (
        <AppBar
            position="static"
            color="primary"
            elevation={0}
            classes={{ root: classes.root }}
            className="user relative flex flex-col items-center justify-center pt-24 pb-64 mb-32 z-0"
        >
            <Typography className="username text-16 whitespace-no-wrap" color="inherit">Grupo 9</Typography>
            <Typography className="email text-13 mt-8 opacity-50 whitespace-no-wrap" color="inherit">grupo9@grupo9.com.br</Typography>
            <Avatar
                className={classNames(classes.avatar, "avatar")}
                alt="user photo"
                src={'http://www.mds.gov.br/webarquivos/arquivo/mds_pra_vc/botoes/Carta_de_Servi%C3%A7o__200x200_CIDADAO.png'}
            />
        </AppBar>
    );
};

function mapStateToProps({ fuse, auth }) {
    return {

    }
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps)(UserNavbarHeader));
