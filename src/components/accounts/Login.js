import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import {login} from "../../actions/auth";


export class Login extends Component {
    static propTypes = {
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        errors: PropTypes.object.isRequired,
    };
    state = {
        username: '',
        password: '',
    };

    onSubmit = e => {
        e.preventDefault();
        this.props.login(this.state.username, this.state.password);
    };

    onChange = e => this.setState({[e.target.name]: e.target.value});

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/"/>
        }
        const {username, password} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Login</h2>
                    <form onSubmit={this.onSubmit}>
                        {this.props.errors.msg.non_field_errors ?
                            <span className='alert alert-danger'>{this.props.errors.msg.non_field_errors}</span>
                            : null
                        }

                        <div className="form-group">
                            <p id="formInstructions" className="mt-3">Fields marked with an asterisk (*) are
                                required.</p>
                            <label>Username *</label>
                            <input
                                type="text"
                                className="form-control"
                                name="username"
                                onChange={this.onChange}
                                value={username}
                                required
                                aria-required="true"
                            />
                        </div>
                        <div className="form-group">
                            <label>Password *</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                onChange={this.onChange}
                                value={password}
                                required
                                aria-required="true"
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                        </div>
                        <p>
                            Don't have an account? <Link to="/Register">Register</Link>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.errors,
});
export default connect(
    mapStateToProps,
    {login}
)(Login);
