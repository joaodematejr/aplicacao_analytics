import React from 'react';
import { Redirect } from 'react-router-dom';
import { FuseUtils } from '@fuse/index';
import { appsConfigs } from 'app/main/apps/appsConfigs';
import { pagesConfigs } from 'app/main/pages/pagesConfigs';
import { ComponentsConfig } from 'app/main/components/ComponentsConfig';
import { LogoutConfig } from 'app/main/logout/LogoutConfig';
import { CallbackConfig } from 'app/main/callback/CallbackConfig';

const routeConfigs = [
    ...appsConfigs,
    ...pagesConfigs,
    ComponentsConfig,
    LogoutConfig,
    CallbackConfig
];

const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
    {
        path: '/',
        exact: true,
        component: () => <Redirect to="/apps/dashboards/project" />
    },
    {
        component: () => <Redirect to="/apps/dashboards/project" />
    }
];

export default routes;
