import axios from 'axios';

export const GET_WIDGETS1 = '[PROJECT DASHBOARD APP] GET WIDGETS';

export function getWidgets1() {
    console.log('carregou widget 1')
    const request = axios.get('/api/project-dashboard-app/widgets');

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type: GET_WIDGETS1,
                payload: response.data
            })
        );
}
