import '@fake-db'
import React, { Component } from 'react';
import { createGenerateClassName, jssPreset } from '@material-ui/core';
import { FuseAuthorization, FuseLayout, FuseTheme } from '@fuse';
import JssProvider from 'react-jss/lib/JssProvider';
import Provider from 'react-redux/es/components/Provider';
import { Router } from 'react-router-dom';
import { create } from 'jss';
import jssExtend from 'jss-extend';
import history from '../history';
import store from './store';
import AppContext from './AppContext';
import routes from './fuse-configs/routesConfig';
import socketIOClient from 'socket.io-client';

const jss = create({
    ...jssPreset(),
    plugins: [...jssPreset().plugins, jssExtend()]
});

jss.options.insertionPoint = document.getElementById('jss-insertion-point');
const generateClassName = createGenerateClassName();


class App extends Component {
    constructor() {
        super();
        this.state = { endpoint: "localhost:9000" };
    }

    send = () => {
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('analytics')
    }

    componentDidMount = () => {
        const socket = socketIOClient(this.state.endpoint);
        socket.on('analytics', function (data) {
            console.log('recebi o evento !!!', data)
        })
    }

    componentDidUpdate() {
        const socket = socketIOClient(this.state.endpoint);
        socket.on('analytics', function (data) {
            console.log('recebi o evento !!!', data)
        })
    }


    render() {
        return (
            <AppContext.Provider value={{ routes }}>
                <JssProvider jss={jss} generateClassName={generateClassName}>
                    <Provider store={store}>
                        <Router history={history}>
                            <FuseAuthorization>
                                <FuseTheme>
                                    <FuseLayout />
                                </FuseTheme>
                            </FuseAuthorization>
                        </Router>
                    </Provider>
                </JssProvider>
            </AppContext.Provider>
        );
    }
}
export default App;
