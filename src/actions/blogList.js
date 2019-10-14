import axios from 'axios';

import {ADD_BLOG, DELETE_BLOG, GET_BLOGITEM, GET_BLOGLIST, UPDATE_BLOG} from '../actionTypes/blog'
import serverData from '../config';
import {tokenConfig} from "./auth";
import {createMessage, returnErrors} from "./messages";

//Upvote
export const blogUpvote = (id) => (dispatch, getState) => {
    axios.get(serverData.django_server + `/api/blog/${id}/upvote/`, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({vote: res.data}));
        })
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

//Downvote
export const blogDownvote = (id) => (dispatch, getState) => {
    axios.get(serverData.django_server + `/api/blog/${id}/downvote/`, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({vote: res.data}));
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
export const getBlogList = (url, order) => (dispatch, getState) => {
    axios.get(serverData.django_server + url, tokenConfig(getState))
        .then(res => {
            if (order === "ascending") {
                res.data.results.sort(function (a, b) {
                    a = a.title.toLowerCase();
                    b = b.title.toLowerCase();

                    return (a < b) ? -1 : (a > b) ? 1 : 0;
                });

            } else if (order === "descending") {
                res.data.results.sort(function (a, b) {
                    a = a.title.toLowerCase();
                    b = b.title.toLowerCase();

                    return (a > b) ? -1 : (a > b) ? 1 : 0;
                });
            }

            dispatch({
                type: GET_BLOGLIST,
                payload: res.data
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
            dispatch(createMessage({}));
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
            if (res.data.draft)
                dispatch(createMessage({addBlog: "Blog Post has been saved as a draft!"}));
            else
                dispatch(createMessage({addBlog: "Blog Post Created Successfully!"}));
            dispatch({
                type: ADD_BLOG,
                payload: res.data
            });
            dispatch(returnErrors({description: ""}))
        }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

//UPDATE_BLOG
export const updateBlog = (id, blog, isImage) => (dispatch, getState) => {
    axios.put(serverData.django_server + `/api/blog/${id}/`, blog, tokenConfig(getState, isImage))
        .then(res => {
            if (res.data.draft)
                dispatch(createMessage({updateBlog: "Blog Post has been saved as a draft!"}));
            else
                dispatch(createMessage({updateBlog: "Blog Post Created Successfully!"}));
            dispatch({
                type: UPDATE_BLOG,
                payload: res.data
            });
        }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};
