import {combineReducers} from 'redux';
import blogList from './blogList'
import auth from './auth'
import errors from "./errors";
import messages from "./messages";
import blogItem from './blogItem';
import comments from './comments';

export default combineReducers({
    blogList,
    blogItem,
    comments,
    errors,
    messages,
    auth
});
