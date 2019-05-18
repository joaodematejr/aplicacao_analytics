import React from 'react';
import { FuseLoadable } from '@fuse';
import { Redirect } from 'react-router-dom';

export const ECommerceAppConfig = {
    settings: {
        layout: {}
    },
    routes: [
        {
            path: '/apps/robo/products/:productId/:productHandle?',
            component: FuseLoadable({
                loader: () => import('./product/Product')
            })
        },
        {
            path: '/apps/robo/products',
            component: FuseLoadable({
                loader: () => import('./products/Products')
            })
        },
        {
            path: '/apps/robo',
            component: () => <Redirect to="/apps/robo/products" />
        }
    ]
};
