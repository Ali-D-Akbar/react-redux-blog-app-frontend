import {ADD_BLOG, DELETE_BLOG, GET_BLOGLIST, UPDATE_BLOG} from "../actionTypes/blog";

const initialState = {
    count: 0,
    results: [],

};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_BLOGLIST:
            return {
                ...state,
                count: action.payload.count,
                results: action.payload.results,

            };
        case DELETE_BLOG:
            return {
                ...state,
                count: state.count - 1,
                results: state.results.filter(blogItem => blogItem.id !== action.payload)
            };
        case ADD_BLOG:
            return {
                ...state,
                count: state.count + 1,
                results: [action.payload, ...state.results]
            };
        case UPDATE_BLOG:
            return {
                ...state,
                results: state.results.filter(blogItem => blogItem.id !== action.payload)
            };
        default:
            return state;
    }
}
