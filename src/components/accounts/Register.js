import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {register} from "../../actions/auth";
import {createMessage} from "../../actions/messages";
import './Register.css'

export class Register extends Component {
    static propTypes = {
        register: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    };
    state = {
        username: "",
        email: "",
        password: "",
        password2: "",
        errors: {
            username: '',
            email: '',
            password: '',
            password2: '',
        }
    };

    onSubmit = e => {
        e.preventDefault();
        const validateForm = (errors) => {
            let valid = true;
            Object.values(errors).forEach(
                // if we have an error string set valid to false
                (val) => val.length > 0 && (valid = false)
            );
            return valid;
        };
        if (validateForm(this.state.errors)) {
            const {username, email, password, password2} = this.state;
            if (password !== password2) {
                this.props.createMessage({passwordNotMatch: "Passwords do not match"});
            } else {
                const newUser = {
                    username,
                    password,
                    email
                };
                this.props.register(newUser);
            }
        } else {
            console.error('Invalid Form')
        }

    };

    onChange = event => {
        const validEmailRegex =
            RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        const {name, value} = event.target;
        let errors = this.state.errors;

        switch (name) {
            case 'username':
                errors.username =
                    value.length < 5
                        ? 'Username must be 5 characters long!'
                        : '';
                break;
            case 'email':
                errors.email =
                    validEmailRegex.test(value)
                        ? ''
                        : 'Email is not valid!';
                break;
            case 'password':
                errors.password =
                    value.length < 8
                        ? 'Password must be 8 characters long!'
                        : '';
                break;
            default:
                break;
        }

        this.setState({errors, [name]: value}, () => {
            console.log(errors)
        });

        // this.setState({[e.target.name]: e.target.value});
    };

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/"/>;
        }
        const {username, email, password, password2} = this.state;
        const {errors} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Register</h2>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control"
                                name="username"
                                onChange={this.onChange}
                                value={username}
                                required
                            />
                            {errors.username.length > 0 &&
                            <span className='error'>{errors.username}</span>}
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                onChange={this.onChange}
                                value={email}
                                required
                            />
                            {errors.email.length > 0 &&
                            <span className='error'>{errors.email}</span>}
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                onChange={this.onChange}
                                value={password}
                                required
                            />
                            {errors.password.length > 0 &&
                            <span className='error'>{errors.password}</span>}
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password2"
                                onChange={this.onChange}
                                value={password2}
                                required
                            />
                            {errors.password2.length > 0 &&
                            <span className='error'>{errors.password2}</span>}
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Register
                            </button>
                        </div>
                        <p>
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(
    mapStateToProps,
    {register, createMessage}
)(Register);