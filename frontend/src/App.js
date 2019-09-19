import React, {Component} from 'react';
import Dashboard from './components/blog/Dashboard.js';
import {HashRouter as Router, Route, Switch} from "react-router-dom";

import {Provider as AlertProvider} from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import {Provider} from 'react-redux';
import store from './store';

import Login from "./components/accounts/Login"
import Register from "./components/accounts/Register";
import PrivateRoute from "./components/common/PrivateRoute";
import Header from "./components/layout/Header";
import {loadUser} from "./actions/auth";

class App extends Component {

    state = {
        blog_list: [],
        currentPage: 1,
        blogsPerPage: 3
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        store.dispatch(loadUser())
    }

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    render() {
        return (
            <Provider store={store}>
                <AlertProvider template={AlertTemplate}>
                    <Router>
                        <Header/>
                        <div className="container">
                            <Switch>
                                <PrivateRoute exact path="/" component={Dashboard}/>
                                <Route exact path="/register" component={Register}/>
                                <Route exact path="/login" component={Login}/>
                            </Switch>
                        </div>
                    </Router>
                </AlertProvider>
            </Provider>
        );
    }
}

export default App;