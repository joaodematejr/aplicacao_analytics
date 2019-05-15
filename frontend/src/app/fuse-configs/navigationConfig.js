const navigationConfig = [
    {
        'id': 'applications',
        'title': 'Analytics',
        'type': 'group',
        'icon': 'apps',
        'children': [
            {
                'id': 'dashboards',
                'title': 'Dashboards',
                'type': 'collapse',
                'icon': 'dashboard',
                'children': [
                    {
                        'id': 'analytics-dashboard',
                        'title': 'Análise V1',
                        'type': 'item',
                        'url': '/apps/dashboards/analytics'
                    },
                    {
                        'id': 'project-dashboard',
                        'title': 'Análise V2',
                        'type': 'item',
                        'url': '/apps/dashboards/project'
                    }
                ]
            },
        ]
    },
    {
        'type': 'divider',
        'id': 'divider-2'
    },
    {
        'id': 'configuracoes',
        'title': 'configurações',
        'type': 'group',
        'icon': 'apps',
        'children': [
            {
                'id': 'configuracoes',
                'title': 'Configurações',
                'type': 'collapse',
                'icon': 'settings',
                'children': [
                    {
                        'id': 'configuracoes-robo',
                        'title': 'Configurações Robo',
                        'type': 'item',
                        'url': '/apps/e-commerce/products/new'
                    },
                    {
                        'id': 'import-csv',
                        'title': 'Importar CSV',
                        'type': 'item',
                        'url': '/apps/importcsv/products/new'
                    },
                ]
            }
        ]
    }
];

export default navigationConfig;
