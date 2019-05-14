import axios from 'axios';

export const GET_WIDGETS1 = '[PROJECT DASHBOARD APP] GET WIDGETS';

export function getWidgets11() {
    // const request = axios.get('http://localhost:9000/analytics');
    const request = axios.get('http://localhost:9000/analytics');

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type: GET_WIDGETS1,
                payload: response.data
            })
        );
}
