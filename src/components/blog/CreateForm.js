import PropTypes from "prop-types";
import React, {Component} from "react";
import {connect} from "react-redux";
import {addBlog} from "../../actions/blogList";

class CreateForm extends Component {
    static propTypes = {
        addBlog: PropTypes.func.isRequired,
        errors: PropTypes.object.isRequired,
        messages: PropTypes.object.isRequired,
    };
    state = {
        title: "",
        description: "",
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
            this.props.addBlog(form_data, true);
        } else {
            this.props.addBlog(form_data);
        }
    };

    saveAsDraft = e => {
        e.preventDefault();
        let form_data = new FormData();
        form_data.append('title', this.state.title);
        form_data.append('description', this.state.description);
        form_data.append("draft", "true");
        if (this.state.image) {
            form_data.append('image', this.state.image, this.state.image.name);
            this.props.addBlog(form_data, true);
        } else {
            this.props.addBlog(form_data);
        }
    };

    render() {
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
                            required
                            aria-required="true"
                        />
                        <label>(Best Size: 1024 x 600)</label>
                    </div>

                    {this.props.errors.msg.description ?
                        <span className='error'>Description is blank! {this.props.errors.msg.description}</span>
                        : null
                    }

                    {this.props.messages.addBlog ?
                        <span className='success'>{this.props.messages.addBlog}</span>
                        : null
                    }

                    <div className="form-group">
                        <button name="submit" value="submit" type="submit" className="mr-4 btn btn-primary">
                            Publish
                        </button>
                        <button name="draft" value="draft" className="btn btn-primary" onClick={this.saveAsDraft}>
                            Save As Draft
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    errors: state.errors,
    messages: state.messages,
});

export default connect(
    mapStateToProps,
    {addBlog}
)(CreateForm);
