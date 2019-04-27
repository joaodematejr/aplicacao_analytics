const navigationConfig = [
    {
        'id': 'applications',
        'title': 'APLICAÇÕES',
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
                        'title': 'Analytics',
                        'type': 'item',
                        'url': '/apps/dashboards/analytics'
                    },
                    {
                        'id': 'project-dashboard',
                        'title': 'Project',
                        'type': 'item',
                        'url': '/apps/dashboards/project'
                    }
                ]
            },
        ]
    }
];

export default navigationConfig;
