import {combineReducers} from 'redux';
import blogList from './blogList'
import auth from './auth'
import errors from "./errors";
import messages from "./messages";
import blogItem from './blogItem';

export default combineReducers({
    blogList,
    blogItem,
    errors,
    messages,
    auth
});