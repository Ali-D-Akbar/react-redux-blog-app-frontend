import axios from 'axios';
import {tokenConfig} from "./auth";

import {ADD_BLOG, CLEAR_BLOGITEM, DELETE_BLOG, GET_BLOGITEM, GET_BLOGLIST, UPDATE_BLOG} from '../actionTypes/blog'
import {createMessage, returnErrors} from "./messages";
import serverData from '../config';

//Upvote
export const blogUpvote = (id) => (dispatch, getState) => {
    axios.get(serverData.django_server + `/api/blog/${id}/upvote/`, tokenConfig(getState))
        .then(res => {
            if (res.data === "already_voted")
                alert("You've already voted!");
            else
                alert("Up voted Successfully!");
        })
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

//Downvote
export const blogDownvote = (id) => (dispatch, getState) => {
    axios.get(serverData.django_server + `/api/blog/${id}/downvote/`, tokenConfig(getState))
        .then(res => {
            if (res.data === "already_voted")
                alert("You've already voted!");
            else
                alert("Down voted Successfully!");
        })
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

//SEARCH BLOGS
export const searchBlogs = (keyword) => (dispatch, getState) => {
    axios.get(serverData.django_server + `/api/blog/${keyword}`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_BLOGLIST,
                payload: res.data
            });
        }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

//GET_BLOGLIST

export const getBlogList = () => (dispatch, getState) => {
    axios.get(serverData.django_server + '/api/blog/', tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_BLOGLIST,
                payload: res.data
            });
            dispatch({
                type: CLEAR_BLOGITEM,
                payload: null
            });
        }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

//GET_BLOGITEM
export const getBlogItem = (id) => (dispatch, getState) => {
    axios.get(serverData.django_server + `/api/blog/${id}/`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_BLOGITEM,
                payload: res.data
            });
            return res;
        }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

//DELETE_BLOG
export const deleteBlog = (id) => (dispatch, getState) => {
    axios.delete(serverData.django_server + `/api/blog/${id}/`, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({deleteBlog: "Blog Deleted"}));
            dispatch({
                type: DELETE_BLOG,
                payload: id
            });
        }).catch(err => console.log(err));
};

//ADD_BLOG
export const addBlog = (blog, isImage) => (dispatch, getState) => {
    axios.post(serverData.django_server + '/api/blog/', blog, tokenConfig(getState, isImage))
        .then(res => {
            dispatch(createMessage({addBlog: "Blog Created Successfully!"}));
            dispatch({
                type: ADD_BLOG,
                payload: res.data
            });
            dispatch(returnErrors({description: ""}))
        }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

//UPDATE_BLOG
export const updateBlog = (id, blog) => (dispatch, getState) => {
    axios.put(serverData.django_server + `/api/blog/${id}/`, blog, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: UPDATE_BLOG,
                payload: id
            });
        }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};
