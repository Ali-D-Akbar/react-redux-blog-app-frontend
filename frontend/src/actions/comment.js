import axios from 'axios';
import {tokenConfig} from "./auth";
import serverData from '../config';
import {returnErrors} from "./messages";
import {ADD_COMMENT, GET_COMMENTS} from "../actionTypes/comments";


//ADD_COMMENT
export const addComment = comment => (dispatch, getState) => {
    axios.post(serverData.django_server + '/api/comment/', comment, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: ADD_COMMENT,
                payload: res.data
            });
        }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};
