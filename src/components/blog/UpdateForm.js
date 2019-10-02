import PropTypes from "prop-types";
import React, {Component} from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {updateBlog} from "../../actions/blogList";

class UpdateForm extends Component {
    static propTypes = {
        updateBlog: PropTypes.func.isRequired,
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        draft: PropTypes.bool.isRequired,
    };
    state = {
        id: this.props.id,
        title: this.props.title,
        description: this.props.description,
        image: "",
        reload: false
    };

    onChange = e => this.setState({[e.target.name]: e.target.value});

    handleImageChange = (e) => {
        this.setState({
            image: e.target.files[0]
        })
    };

    onSubmit = e => {
        e.preventDefault();
        let form_data = new FormData();
        form_data.append('title', this.state.title);
        form_data.append('description', this.state.description);
        if (this.state.image) {
            form_data.append('image', this.state.image, this.state.image.name);
            this.props.updateBlog(this.state.id, form_data, true);
        } else {
            this.props.updateBlog(this.state.id, form_data);
        }

        setTimeout(() => this.setState({reload: true}), 1000);
    };

    saveAsDraft = e => {
        e.preventDefault();
        let form_data = new FormData();
        form_data.append('title', this.state.title);
        form_data.append('description', this.state.description);
        form_data.append("draft", "true");
        if (this.state.image) {
            form_data.append('image', this.state.image, this.state.image.name);
            this.props.updateBlog(this.state.id, form_data, true);
        } else {
            this.props.updateBlog(this.state.id, form_data);
        }

        this.setState({
            title: "",
            description: "",
            image: ""
        });
        setTimeout(() => this.setState({reload: true}), 1000);
    };

    render() {
        if (this.state.reload) {
            return <Redirect to="/"/>;
        }
        const {title, description} = this.state;
        return (
            <div className="card card-body mt-4 mb-4">
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <p id="formInstructions" className="mt-3">Fields marked with an asterisk (*) are required.</p>
                        <label>Title *</label>
                        <input
                            className="form-control"
                            type="text"
                            name="title"
                            onChange={this.onChange}
                            value={title}
                            required
                            aria-required="true"
                        />
                    </div>
                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            className="form-control"
                            rows="10"
                            name="description"
                            onChange={this.onChange}
                            value={description}
                            required
                            aria-required="true"
                        />
                    </div>
                    <div className="form-group">
                        *
                        <input
                            className="btn"
                            type="file"
                            name="image"
                            onChange={this.handleImageChange}
                            accept="image/*"
                        />
                        <label>(Best Size: 1024 x 600)</label>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="mr-4 rounded btn btn-primary">
                            Publish
                        </button>
                        {this.props.draft ?
                            <button name="draft" value="draft" className="btn btn-primary" onClick={this.saveAsDraft}>
                                Save As Draft
                            </button>
                            : null
                        }
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
