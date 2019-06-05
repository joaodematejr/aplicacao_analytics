import { showMessage } from 'app/store/actions/fuse';
import axios from 'axios';

export const GET_PRODUCT = '[E-COMMERCE APP] GET PRODUCT';
export const SAVE_PRODUCT = '[E-COMMERCE APP] SAVE PRODUCT';

export function getProduct(params) {
    const request = axios.get('/api/e-commerce-app/product', { params });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type: GET_PRODUCT,
                payload: response.data
            })
        );
}

export function saveProduct(data) {
    const request = axios.post('/api/e-commerce-app/product/save', data);

    return (dispatch) =>
        request.then((response) => {

            dispatch(showMessage({ message: 'Product Saved' }));

            return dispatch({
                type: SAVE_PRODUCT,
                payload: response.data
            })
        }
        );
}

export function newProduct() {
    const data = {
        url: '',
        login: '',
        senha: '',
        navegador: '',
        csvColuna: '',

    };

    return {
        type: GET_PRODUCT,
        payload: data
    }
}
