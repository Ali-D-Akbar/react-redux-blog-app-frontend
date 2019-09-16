import axios from 'axios';
import {tokenConfig} from "./auth";

import {ADD_BLOG, DELETE_BLOG, GET_BLOGLIST} from './types';
import {returnErrors} from "./messages";

//GET_BLOGLIST

export const getBlogList = () => (dispatch, getState) => {
    axios.get('/api/blog/', tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_BLOGLIST,
                payload: res.data
            });
        }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

//DELETE_BLOG
export const deleteBlog = (id) => (dispatch, getState) => {
    axios.delete(`/api/blog/${id}/`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_BLOG,
                payload: id
            });
        }).catch(err => console.log(err));
};

//ADD_BLOG
export const addBlog = blog => (dispatch, getState) => {
    console.log(blog);
    axios.post('/api/blog/', blog, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: ADD_BLOG,
                payload: res.data
            });
        }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};