
import store from 'app/store';

export const LogoutConfig = {
    routes: [
        {
            path: '/logout',
            component: () => {
                store.dispatch();
                return 'Logging out..'
            }
        }
    ]
};

