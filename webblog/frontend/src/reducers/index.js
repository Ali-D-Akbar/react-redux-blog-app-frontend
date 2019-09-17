import {combineReducers} from 'redux';
import blogList from './blogList'
import auth from './auth'
import errors from "./errors";
import messages from "./messages";

export default combineReducers({
    blogList,
    errors,
    messages,
    auth
});