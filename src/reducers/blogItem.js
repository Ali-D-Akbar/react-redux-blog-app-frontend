import {CLEAR_BLOGITEM, GET_BLOGITEM, UPDATE_BLOG} from "../actionTypes/blog";

const initialState = {
    blogItem: null,
    loading: true
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_BLOGITEM:
            return {
                ...state,
                blogItem: action.payload,
                loading: false
            };
        case CLEAR_BLOGITEM:
            return {
                blogItem: null,
                loading: true
            };
        case UPDATE_BLOG:
            return {
                blogItem: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
