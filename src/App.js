import React, {Component} from 'react';
import Dashboard from './components/blog/Dashboard.js';
import {HashRouter as Router, Route, Switch} from "react-router-dom";

import {Provider} from 'react-redux';
import store from './store';

import Login from "./components/accounts/Login"
import Register from "./components/accounts/Register";
import PrivateRoute from "./components/common/PrivateRoute";
import Header from "./components/layout/Header";
import {loadUser} from "./actions/auth";
import BlogItem from "./components/blog/BlogItem";

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        store.dispatch(loadUser())
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Header/>
                    <div className="container">
                        <Switch>
                            <PrivateRoute exact path="/" component={Dashboard}/>
                            <Route exact path="/register" component={Register}/>
                            <Route exact path="/blogitem" component={BlogItem}/>
                            <Route exact path="/login" component={Login}/>
                        </Switch>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;