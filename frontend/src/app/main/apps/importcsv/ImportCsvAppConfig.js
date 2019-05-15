import React from 'react';
import { FuseLoadable } from '@fuse';
import { Redirect } from 'react-router-dom';

export const ImportCsvAppConfig = {
    settings: {
        layout: {}
    },
    routes: [
        {
            path: '/apps/importcsv/products/:productId/:productHandle?',
            component: FuseLoadable({
                loader: () => import('./product/Product')
            })
        },
        {
            path: '/apps/importcsv/products',
            component: FuseLoadable({
                loader: () => import('./products/Products')
            })
        },
        {
            path: '/apps/importcsv',
            component: () => <Redirect to="/apps/importcsv/products" />
        }
    ]
};
