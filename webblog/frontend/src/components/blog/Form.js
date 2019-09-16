import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {addBlog} from "../../actions/blogList";

export class Form extends Component {
    static propTypes = {
        addBlog: PropTypes.func.isRequired
    };
    state = {
        title: "",
        description: "",
    };

    onChange = e => this.setState({[e.target.name]: e.target.value});

    onSubmit = e => {
        e.preventDefault();
        const {title, description} = this.state;
        const blogItem = {title, description};
        this.props.addBlog(blogItem);
        this.setState({
            title: "",
            description: "",
        });
    };

    render() {
        const {title, description} = this.state;
        return (
            <div className="card card-body mt-4 mb-4">
                <h2>Add Blog</h2>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            className="form-control"
                            type="text"
                            name="title"
                            onChange={this.onChange}
                            value={title}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            className="form-control"
                            name="description"
                            onChange={this.onChange}
                            value={description}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default connect(
    null,
    {addBlog}
)(Form);