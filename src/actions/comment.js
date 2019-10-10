import axios from 'axios';
import serverData from '../config';
import {tokenConfig} from "./auth";
import {returnErrors} from "./messages";


//ADD_COMMENT
export const addComment = comment => (dispatch, getState) => {
    axios.post(serverData.django_server + '/api/comment/', comment, tokenConfig(getState))
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

//DELETE_COMMENT
export const deleteComment = (id) => (dispatch, getState) => {
    axios.delete(serverData.django_server + `/api/comment/${id}/`, tokenConfig(getState))
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};
