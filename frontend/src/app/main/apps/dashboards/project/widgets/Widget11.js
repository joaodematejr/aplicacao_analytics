import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from '@lodash';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions';

const styles = theme => ({

})

class Widget11 extends Component {

    componentDidMount() {
        this.props.getWidgets11();
    }

    render() {
        const { widgets11 } = this.props;

        let listaPaises = _.map(widgets11, paises => ({
            id: Math.random(),
            name: paises,
        }));

        console.log('widgets11', listaPaises)

        return (
            <Paper className="w-full rounded-8 shadow-none border-1">
                <div className="flex items-center justify-between px-16 h-64 border-b-1">
                    <Typography className="text-16">Todos os Países</Typography>
                    <Typography className="text-11 font-500 rounded-4 text-white bg-blue px-8 py-4">{'0' + " Países"}</Typography>
                </div>
                <div className="table-responsive">
                    <Table className="w-full min-w-full" padding="dense">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Países</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listaPaises.map(row => (
                                <TableRow key={row.id}>
                                    <TableCell align="left">{row.id}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getWidgets11: Actions.getWidgets11,
    }, dispatch);
}

function mapStateToProps({ projectDashboardApp }) {
    return {
        widgets11: projectDashboardApp.widgets11,
    }
}

export default withStyles(styles, { withTheme: false })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Widget11)));
