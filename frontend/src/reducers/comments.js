import {ADD_COMMENT, CLEAR_COMMENTS} from "../actionTypes/comments";

const initialState = {
    comments: []

};

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_COMMENT:
            return {
                ...state,
                comments: [...state.comments, action.payload]
            };
        case CLEAR_COMMENTS:
            return {
                comments: []
            };
        default:
            return state;
    }
}
