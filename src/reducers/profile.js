import {PROFILE_LOADED, PROFILE_LOADING} from "../actionTypes/profile";


const initialState = {
    isLoading: true,
    user: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case PROFILE_LOADING:
            return {
                ...state,
                isLoading: true,
                user:null,
            };

        case PROFILE_LOADED:
            return {
                ...state,
                isLoading: false,
                user: action.payload,
            };
        default:
            return state;
    }
}
