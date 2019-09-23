import {GET_BLOGITEM} from "../actionTypes/blog";

const initialState = {
    blogItem: null

};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_BLOGITEM:
            return {
                blogItem: action.payload
            };
        default:
            return state;
    }
}
