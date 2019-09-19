import {ADD_BLOG, DELETE_BLOG, GET_BLOGLIST} from "../actionTypes/blogList";

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
                blogList: state.blogList.filter(lead => lead.id !== action.payload)
            };
        case ADD_BLOG:
            return {
                ...state,
                blogList: [...state.blogList, action.payload]
            };
        default:
            return state;
    }
}