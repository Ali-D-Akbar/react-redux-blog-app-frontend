import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
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

        this.setState({
            title: "",
            description: "",
            image: ""
        });
        setTimeout(() => this.setState({reload: true}), 1000);
    };

    render() {
        const {title, description} = this.state;
        if (this.state.reload) {
            window.location.reload();
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
                        <input
                            className="btn"
                            type="file"
                            name="image"
                            onChange={this.handleImageChange}
                            accept="image/*"/>
                    </div>
                    {this.props.errors.msg.description ?
                        <span className='error'>Description is blank! {this.props.errors.msg.description}</span>
                        : null}

                    {this.props.messages.addBlog ?
                        <span className='success'>{this.props.messages.addBlog}</span>
                        : null}


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

const mapStateToProps = state => ({
    errors: state.errors,
    messages: state.messages,
});

export default connect(
    mapStateToProps,
    {addBlog}
)(CreateForm);
