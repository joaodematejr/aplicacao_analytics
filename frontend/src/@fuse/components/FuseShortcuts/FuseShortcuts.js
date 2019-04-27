import { FuseAnimateGroup, FuseUtils } from '@fuse';
import _ from '@lodash';
import { Icon, IconButton, Menu, Tooltip, withStyles } from '@material-ui/core';
import amber from '@material-ui/core/colors/amber';
import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

const propTypes = {};

const defaultProps = {
    variant: "horizontal"
};

const styles = theme => ({
    root: {
        '&.horizontal': {},
        '&.vertical': {
            flexDirection: 'column'
        }
    },
    item: {
        textDecoration: 'none!important'
    },
    addIcon: {
        color: amber[600]
    }
});

class FuseShortcuts extends Component {

    state = {
        addMenu: null,
        searchText: '',
        searchResults: null,
        flatNavigation: null
    };

    componentDidMount() {
        this.flattenNavigation(this.props.navigation);
    }

    addMenuClick = event => {
        this.setState({ addMenu: event.currentTarget });
    };

    addMenuClose = () => {
        this.setState({ addMenu: null });
    };

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.props.location, prevProps.location)) {
            this.flattenNavigation(this.props.navigation);
        }
    }

    flattenNavigation(navigation) {
        this.setState({ flatNavigation: FuseUtils.getFlatNavigation(navigation) })
    }

    search = (ev) => {
        const searchText = ev.target.value;
        this.setState({ searchText });
        if (searchText.length !== 0 && this.state.flatNavigation) {
            this.setState({
                searchResults: this.state.flatNavigation.filter(item => item.title.toLowerCase().includes(searchText))
            });
            return;
        }
        this.setState({ searchResults: null });
    };

    toggleInShortcuts = (id) => {
        let shortcuts = [...this.props.shortcuts];
        shortcuts = shortcuts.includes(id) ? shortcuts.filter(_id => id !== _id) : [...shortcuts, id];
        this.props.updateUserShortcuts(shortcuts);
    };

    render() {
        const { classes, shortcuts, navigation, variant, className } = this.props;
        const { addMenu } = this.state;
        const shortcutItems = shortcuts ? shortcuts.map(id => FuseUtils.findById(navigation, id)) : [];

        return (
            <div className={classNames(classes.root, variant, "flex flex-1", variant === "vertical" && "flex-no-grow flex-shrink", className)}>

                <FuseAnimateGroup
                    enter={{
                        animation: "transition.expandIn"
                    }}
                    className={classNames("flex flex-1", variant === "vertical" && "flex-col")}
                >
                    {shortcutItems.map(item => item && (
                        <Link to={item.url} key={item.id} className={classes.item}>
                            <Tooltip title={item.title} placement={variant === "horizontal" ? "bottom" : "left"}>
                                <IconButton className="w-40 h-40 p-0">
                                    {item.icon ?
                                        (
                                            <Icon>{item.icon}</Icon>
                                        ) :
                                        (
                                            <span className="text-20 font-bold uppercase">{item.title[0]}</span>
                                        )
                                    }
                                </IconButton>
                            </Tooltip>
                        </Link>
                    ))}
                </FuseAnimateGroup>
                <Menu
                    id="add-menu"
                    anchorEl={addMenu}
                    open={Boolean(addMenu)}
                    onClose={this.addMenuClose}
                    classes={{
                        paper: 'mt-48'
                    }}
                    onEntered={() => {
                        this.searchInput.focus();
                    }}
                    onExited={() => {
                        this.setState({ searchText: '' });
                    }}>
                </Menu>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

function mapStateToProps({ fuse, auth }) {
    return {
        navigation: fuse.navigation,
    }
}

FuseShortcuts.propTypes = propTypes;
FuseShortcuts.defaultProps = defaultProps;

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FuseShortcuts));
