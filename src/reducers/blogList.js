import {ADD_BLOG, DELETE_BLOG, GET_BLOGLIST} from "../actionTypes/blog";

const initialState = {
    count: 0,
    results: [],
    loading: true

};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_BLOGLIST:
            return {
                ...state,
                count: action.payload.count,
                results: action.payload.results,
                loading: false
            };
        case DELETE_BLOG:
            return {
                ...state,
                count: state.count - 1,
                results: state.results.filter(blogItem => blogItem.id !== action.payload),
                loading: true,
            };
        case ADD_BLOG:
            return {
                ...state,
                count: state.count + 1,
                results: [action.payload, ...state.results],
            };
        default:
            return state;
    }
}
