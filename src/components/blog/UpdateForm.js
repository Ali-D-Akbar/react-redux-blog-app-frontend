import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {updateBlog} from "../../actions/blogList";
import {Redirect} from "react-router-dom";

class UpdateForm extends Component {
    static propTypes = {
        updateBlog: PropTypes.func.isRequired,
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string
    };
    state = {
        id: this.props.id,
        title: this.props.title,
        description: this.props.description,
        redirect: false
    };

    onChange = e => this.setState({[e.target.name]: e.target.value});

    onSubmit = e => {
        e.preventDefault();
        const {title, description} = this.state;
        const blogItem = {title, description};
        this.props.updateBlog(this.state.id, blogItem);
        this.setState({
            title: "",
            description: ""
        });
        setTimeout(() => this.setState({ redirect: true }), 1000);
    };

    render() {
        const {title, description} = this.state;
        if (this.state.redirect) {
            return <Redirect to='/'/>
        }
        return (

            <div className="card card-body mt-4 mb-4">
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            className="form-control"
                            type="text"
                            name="title"
                            onChange={this.onChange}
                            value={title}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            className="form-control"
                            rows="10"
                            name="description"
                            onChange={this.onChange}
                            value={description}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Post
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default connect(
    null,
    {updateBlog}
)(UpdateForm);
