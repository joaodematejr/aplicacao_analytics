import '@fake-db';
import { FuseAuthorization, FuseLayout, FuseTheme } from '@fuse';
import { createGenerateClassName, jssPreset } from '@material-ui/core';
import { create } from 'jss';
import jssExtend from 'jss-extend';
import React, { Component } from 'react';
import JssProvider from 'react-jss/lib/JssProvider';
import Provider from 'react-redux/es/components/Provider';
import { Router } from 'react-router-dom';
import history from '../history';
import AppContext from './AppContext';
import routes from './fuse-configs/routesConfig';
import store from './store';

const jss = create({
    ...jssPreset(),
    plugins: [...jssPreset().plugins, jssExtend()]
});

jss.options.insertionPoint = document.getElementById('jss-insertion-point');
const generateClassName = createGenerateClassName();


class App extends Component {

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
