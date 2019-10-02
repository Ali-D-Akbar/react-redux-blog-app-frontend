import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import {loadUser} from "./actions/auth";
import './App.css'

import Login from "./components/accounts/Login"
import Register from "./components/accounts/Register";
import BlogItem from "./components/blog/BlogItem";
import Dashboard from './components/blog/Dashboard.js';
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

// import Header from "/components/layout/Header";
import store from './store';

class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser())
    }

    render() {
        return (
            <div id="page-container">
                <div id="content-wrap">
                    <Provider store={store}>
                        <Router>
                            <Header/>
                            <div className="container">
                                <Switch>
                                    <Route exact path="/" component={Dashboard}/>
                                    <Route exact path="/register" component={Register}/>
                                    <Route exact path="/login" component={Login}/>
                                    <Route exact path="/blogitem/:blogId" component={BlogItem}/>
                                </Switch>
                            </div>
                            <br/>
                            <Footer/>
                        </Router>
                    </Provider>
                </div>
            </div>
        );
    }
}

export default App;
