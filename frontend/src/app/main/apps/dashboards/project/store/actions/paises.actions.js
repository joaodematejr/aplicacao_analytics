import axios from 'axios';

export const GET_PAISES = '[PROJECT DASHBOARD APP] GET WIDGETS';

export function getPaises() {
    // const request = axios.get('http://localhost:9000/analytics');
    const request = axios.get('http://localhost:9000/analytics');

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type: GET_PAISES,
                payload: response.data
            })
        );
}
