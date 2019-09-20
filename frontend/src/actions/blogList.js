import axios from 'axios';
import {tokenConfig} from "./auth";

import {ADD_BLOG, CLEAR_BLOGITEM, DELETE_BLOG, GET_BLOGITEM, GET_BLOGLIST, UPDATE_BLOG} from '../actionTypes/blog'
import {createMessage, returnErrors} from "./messages";
import serverData from '../config';
import React from "react";
import {Redirect} from "react-router-dom";
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
    console.log(id);
    axios.get(serverData.django_server + `/api/blog/${id}/`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_BLOGITEM,
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
    axios.post(serverData.django_server + '/api/blog/', blog, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: ADD_BLOG,
                payload: res.data
            });
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