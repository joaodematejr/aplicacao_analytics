import { Paper, Table, TableBody, TableCell, TableRow, Typography, withStyles } from '@material-ui/core';
import withReducer from 'app/store/withReducer';
import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import reducer from '../store/reducers';

const styles = theme => ({

})

class Widget11 extends Component {
    constructor(props) {
        super(props);
        this.state = { responseJson: [] }
    }

    componentDidMount() {
        axios.get('http://localhost:9000/analytics')
            .then(response => this.setState({ responseJson: response.data }))
            .catch(error => console.log('error', error));

    }

    render() {
        const { responseJson } = this.state;
        let listaPaises = _.map(responseJson, paises => ({
            id: Math.random(),
            name: paises,
        }));

        return (
            <Paper className="w-full rounded-8 shadow-none border-1">
                <div className="flex items-center justify-between px-16 h-64 border-b-1">
                    <Typography className="text-16">Todos os Países</Typography>
                    <Typography className="text-11 font-500 rounded-4 text-white bg-blue px-8 py-4">{listaPaises.length + ' Países'}</Typography>
                </div>
                <div className="table-responsive">
                    <Table className="w-full min-w-full" padding="dense">
                        <TableBody>
                            {listaPaises.map(row => (
                                <TableRow key={row.id}>
                                    <TableCell align="left">{row.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        );
    }
}

export default withReducer('projectDashboardApp', reducer)(withStyles(styles, { withTheme: true })(withRouter(connect()(Widget11))));
