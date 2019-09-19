import {ADD_BLOG, DELETE_BLOG, GET_BLOGLIST, UPDATE_BLOG} from "../actionTypes/blog";

const initialState = {
    blogList: []

};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_BLOGLIST:
            return {
                ...state,
                blogList: action.payload
            };
        case DELETE_BLOG:
            return {
                ...state,
                blogList: state.blogList.filter(blogItem => blogItem.id !== action.payload)
            };
        case ADD_BLOG:
            return {
                ...state,
                blogList: [...state.blogList, action.payload]
            };
        case UPDATE_BLOG:
            return {
                ...state,
                blogList: [...state.blogList, action.payload]
            };
        default:
            return state;
    }
}