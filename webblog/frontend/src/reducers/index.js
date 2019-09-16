import { combineReducers } from 'redux';
import blogList from './blogList'
import auth from './auth'

export default combineReducers({
    blogList,
    auth
});