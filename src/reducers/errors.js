import {GET_ERRORS} from "../actionTypes/types";

const initialState = {
    msg: {},
    status: null
};

export default function (state = initialState, action) {
    if (action.type === GET_ERRORS) {
        return {
            msg: action.payload.message,
            status: action.payload.status
        };
    } else {
        return state;
    }
}
