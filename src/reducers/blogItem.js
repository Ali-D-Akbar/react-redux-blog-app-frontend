import {CLEAR_BLOGITEM, GET_BLOGITEM} from "../actionTypes/blog";

const initialState = {
    blogItem: null

};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_BLOGITEM:
            return {
                blogItem: action.payload
            };
        case CLEAR_BLOGITEM:
            return {
                blogItem: null
            };
        default:
            return state;
    }
}
