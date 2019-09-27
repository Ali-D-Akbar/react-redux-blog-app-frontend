import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {addBlog} from "../../actions/blogList";

class CreateForm extends Component {
    static propTypes = {
        addBlog: PropTypes.func.isRequired,
    };
    state = {
        title: "",
        description: "",
        image: ""
    };

    onChange = e => this.setState({[e.target.name]: e.target.value});

    onSubmit = e => {
        e.preventDefault();
        console.log(this.state);
        let form_data = new FormData();
        form_data.append('title', this.state.title);
        form_data.append('description', this.state.description);
        this.props.addBlog(form_data);


        this.setState({
            title: "",
            description: "",
            image: ""
        });
    };

    render() {
        const {title, description} = this.state;
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
    {addBlog}
)(CreateForm);
