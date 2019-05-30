import { Icon, IconButton, Paper, Select, Typography, withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions';

const styles = theme => ({


})

class Widget1 extends Component {
    state = {
        currentRange: this.props.widget.currentRange
    };

    handleChangeSelect = (ev) => {
        this.setState({ [ev.target.name]: ev.target.value });
    };

    componentDidMount() {
        this.props.getWidgets1();
    }

    render() {
        const { widget } = this.props;
        const { currentRange } = this.state;

        console.log('widget', widget)

        return (
            <Paper className="w-full rounded-8 shadow-none border-1">
                <div className="flex items-center justify-between pr-4 pl-16 pt-4">
                    <Select
                        native
                        value={this.state.currentRange}
                        onChange={this.handleChangeSelect}
                        inputProps={{
                            name: 'currentRange'
                        }}
                        disableUnderline={true} >
                        {Object.entries(widget.ranges).map(([key, n]) => {
                            return (
                                <option key={key} value={key}>{n}</option>
                            )
                        })}
                    </Select>
                    <IconButton aria-label="more">
                        <Icon>more_vert</Icon>
                    </IconButton>
                </div>
                <div className="text-center pt-12 pb-28">
                    <Typography
                        className="text-72 leading-none text-blue">{widget.data.count[currentRange]}</Typography>
                    <Typography className="text-16" color="textSecondary">{widget.data.label}</Typography>
                </div>
                <div className="flex items-center px-16 h-52 border-t-1">
                    <Typography className="text-15 flex w-full" color="textSecondary">
                        <span className="truncate">{widget.data.extra.label}</span>
                        :
                        <b className="pl-8">{widget.data.extra.count[currentRange]}</b>
                    </Typography>
                </div>
            </Paper>
        );
    }
}



function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getWidgets1: Actions.getWidgets1,
    }, dispatch);
}

function mapStateToProps({ projectDashboardApp }) {
    return {
        widgets1: projectDashboardApp.widgets1,
    }
}


export default withStyles(styles, { withTheme: false })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Widget1)));
