import axios from 'axios';
import {returnErrors} from "./messages";
import {
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    USER_LOADED,
    USER_LOADING
} from "../actionTypes/auth";
import serverData from '../config';

export const tokenConfig = (getState, isMultipart=false) => {
    // Get token from state
    const token = getState().auth.token;

    // Headers
    let config;
    if (isMultipart) {
        config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
    }
    else {
        config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
    }

    // If token, add to headers config
    if (token) {
        config.headers["Authorization"] = `Token ${token}`;
    }

    return config;
};


//CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    // User Loading
    dispatch({type: USER_LOADING});
    const token = getState().auth.token;
    const config = {
        headers: {
            "Content-Type": "application/json"
        }

    };

    if (token) {
        config.headers["Authorization"] = `token ${token}`;
    }

    axios
        .get(serverData.django_server + "/api/auth/user", tokenConfig(getState))
        .then(res => {
            dispatch({
                type: USER_LOADED,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR
            });
        });
};

// LOGIN USER
export const login = (username, password) => dispatch => {
    // Headers
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Request Body
    const body = JSON.stringify({username, password});
    axios
        .post(serverData.django_server + "/api/auth/login", body, config)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: LOGIN_FAIL
            });
        });
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
    axios
        .post(serverData.django_server + "/api/auth/logout/", null, tokenConfig(getState))
        .then(() => {
            dispatch({
                type: LOGOUT_SUCCESS
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
};


// REGISTER USER
export const register = ({username, password, email}) => dispatch => {
    // Headers
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Request Body
    const body = JSON.stringify({username, email, password});

    axios
        .post(serverData.django_server + "/api/auth/register", body, config)
        .then(res => {
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });

        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: REGISTER_FAIL
            });
        });
};
