import {GET_ERRORS} from "../actionTypes/types";

const initialState = {
    msg: {},
    status: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            return {
                msg: action.payload.message,
                status: action.payload.status
            };
        default:
            return state;
    }
}
