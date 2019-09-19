import axios from 'axios';
import {tokenConfig} from "./auth";

import {ADD_BLOG, DELETE_BLOG, GET_BLOGLIST} from '../actionTypes/blogList'
import {createMessage, returnErrors} from "./messages";
import serverData from '../config';
//GET_BLOGLIST

export const getBlogList = () => (dispatch, getState) => {
    axios.get(serverData.django_server + '/api/blog/', tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_BLOGLIST,
                payload: res.data
            });
        }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

//DELETE_BLOG
export const deleteBlog = (id) => (dispatch, getState) => {
    axios.delete(serverData.django_server + `/api/blog/${id}/`, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({deleteLead: "Lead Deleted"}));
            dispatch({
                type: DELETE_BLOG,
                payload: id
            });
        }).catch(err => console.log(err));
};

//ADD_BLOG
export const addBlog = blog => (dispatch, getState) => {
    console.log(blog);
    axios.post(serverData.django_server + '/api/blog/', blog, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: ADD_BLOG,
                payload: res.data
            });
        }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};