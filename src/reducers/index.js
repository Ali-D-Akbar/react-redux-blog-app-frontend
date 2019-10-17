import {combineReducers} from 'redux';
import auth from './auth'
import blogItem from './blogItem';
import blogList from './blogList'
import errors from "./errors";
import messages from "./messages";
import profile from "./profile";

export default combineReducers({
    blogList,
    blogItem,
    errors,
    messages,
    auth,
    profile,
});
