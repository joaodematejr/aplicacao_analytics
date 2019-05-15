import * as Actions from '../actions';

const initialState = null;

const paisesReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_PAISES:
            return {
                ...action.payload
            };
        default:
            return state;
    }
};

export default paisesReducer;
