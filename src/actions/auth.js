import axios from 'axios';
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
import {PROFILE_LOADED, PROFILE_LOADING} from "../actionTypes/profile";


import serverData from '../config';
import {createMessage, returnErrors} from "./messages";

export const tokenConfig = (getState, isMultipart = false) => {
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
    } else {
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

    axios
        .get(serverData.django_server + "/api/auth/user", tokenConfig(getState))
        .then(res => {
            axios
                .get(serverData.django_server + `/api/users/${res.data.username}/`, tokenConfig(getState))
                .then(res => {
                    dispatch({
                        type: USER_LOADED,
                        payload: res.data
                    });
                })
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
            dispatch(createMessage({login: `Welcome ${username.charAt(0).toUpperCase() + username.slice(1)} to the weblog. Checkout our blog posts!`}));
            axios
                .get(serverData.django_server + `/api/users/${res.data.user.username}/`, config)
                .then(res => {
                    dispatch({
                        type: USER_LOADED,
                        payload: res.data
                    });
                })
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
            dispatch(createMessage({login: null}));
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
            dispatch(createMessage({login: `Welcome ${username.charAt(0).toUpperCase() + username.slice(1)} to the weblog. Checkout our blog posts!`}));
            axios
                .get(serverData.django_server + `/api/users/${res.data.user.username}/`, config)
                .then(res => {
                    dispatch({
                        type: USER_LOADED,
                        payload: res.data
                    });
                })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: REGISTER_FAIL
            });
        });
};

export const getProfile = (username) => (dispatch, getState) => {
    dispatch({type: PROFILE_LOADING});
    axios
        .get(serverData.django_server + `/api/users/${username}/`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: PROFILE_LOADED,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
};


//UPDATE_USER_DATA
export const updateUser = (username, body) => (dispatch, getState) => {
    axios
        .patch(serverData.django_server + `/api/users/${username}/`, body, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: PROFILE_LOADED,
                payload: res.data
            });
            dispatch(returnErrors('email', ''));
            dispatch(createMessage({profile: 'Profile Updated!'}));
        })
        .then(() => {
            setTimeout(() => dispatch(createMessage({profile: ''})), 2000)
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
};


//UPDATE_USER_DATA
export const updateProfile = (id, body, isImage) => (dispatch, getState) => {
    axios
        .patch(serverData.django_server + `/api/Profile/${id}/`, body, tokenConfig(getState, isImage))
        .then(res => {
            dispatch(returnErrors('email', ''));
            axios
                .get(serverData.django_server + `/api/users/${res.data.userid}/`, tokenConfig(getState))
                .then(res => {
                    dispatch({
                        type: PROFILE_LOADED,
                        payload: res.data
                    });
                    dispatch(createMessage({profile: 'Profile Updated!'}));
                })
        })
        .then(() => {
            setTimeout(() => dispatch(createMessage({profile: ''})), 2000)
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
};
