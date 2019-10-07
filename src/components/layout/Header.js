import React, {Component} from "react";
import {Link} from 'react-router-dom';
import {logout} from "../../actions/auth";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import weblog from '../../../public/weblog.png'
import CreateForm from "../blog/CreateForm";
import CreateBlogModal from "../modal/CreateBlogModal";
import './Header.css'
import {getBlogList} from "../../actions/blogList";

class Header extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired
    };

    state = {
        modalShow: false,
    };

    logoutClick = e => {
        this.props.logout();
        setTimeout(() => this.props.getBlogList('/api/blog/'), 1000);
    };

    showModal = () => {
        this.setState({modalShow: true});
    };

    hideModal = () => {
        this.setState({modalShow: false});
    };

    render() {
        const {isAuthenticated} = this.props.auth;

        const authLinks = (
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                <li className="nav-item  mr-2">
                    <button className="rounded btn btn-secondary" type="button"
                            onClick={this.showModal}>
                        Add New Blog
                    </button>
                </li>
                <li className="nav-item">
                    <button onClick={this.logoutClick} className="rounded btn btn-info">
                        Logout
                    </button>
                </li>
            </ul>
        );

        const guestLinks = (
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                <li className="nav-item mr-2">
                    <Link to="/register" className="nav-link">
                        <button className="btn btn-secondary">
                            Register
                        </button>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/login" className="nav-link">
                        <button className="btn btn-secondary">
                            Login
                        </button>
                    </Link>
                </li>
            </ul>
        );

        return (
            <nav className="navbar navbar-expand-sm navbar-light blue">
                <CreateBlogModal show={this.state.modalShow} handleClose={this.hideModal} title="Add New Blog">
                    <CreateForm/>
                </CreateBlogModal>
                <div className="container">
                    <button
                        className="rounded navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarTogglerDemo01"
                        aria-controls="navbarTogglerDemo01"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"/>
                    </button>
                    <div className="rounded collapse navbar-collapse" id="navbarTogglerDemo01">
                        <a className="navbar-brand" href="#">
                            <img height="50"
                                 width="100"
                                 src={weblog}
                                 alt="logo"
                            />
                        </a>
                    </div>
                    {isAuthenticated ? authLinks : guestLinks}
                </div>
            </nav>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(
    mapStateToProps,
    {logout, getBlogList}
)(Header);
