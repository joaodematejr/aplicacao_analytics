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
    }
];

export default navigationConfig;
