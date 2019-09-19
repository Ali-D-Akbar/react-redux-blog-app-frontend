import {CREATE_MESSAGE, GET_ERRORS} from "../actionTypes/types";

// CREATE MESSAGE
export const createMessage = msg => {
    return {
        type: CREATE_MESSAGE,
        payload: msg
    };
};

//RETURN_ERRORS
export const returnErrors = (message, status) => {
    return {
        type: GET_ERRORS,
        payload: {message, status}
    };
};