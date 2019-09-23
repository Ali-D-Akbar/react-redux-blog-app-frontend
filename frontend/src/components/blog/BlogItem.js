import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {deleteBlog, getBlogItem} from "../../actions/blogList";
import UpdateForm from "./UpdateForm";
import {Redirect} from "react-router-dom";
import {addComment} from "../../actions/comment";


class BlogItem extends Component {
    static propTypes = {
        blogItem: PropTypes.object.isRequired,
        auth: PropTypes.object.isRequired,
        deleteBlog: PropTypes.func.isRequired,
        getBlogItem: PropTypes.func.isRequired,
        addComment: PropTypes.func.isRequired,
    };

    state = {
        commentDescription: "",
        redirect: false,
    };

    componentDidMount() {
        const {id} = this.props.location.props;
        this.props.getBlogItem(id);
    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };

    onClick = e => {
        this.props.deleteBlog(this.props.blogItem.id);
        this.setState({
            redirect: true
        });
    };

    postComment = e => {
        e.preventDefault();
        const {commentDescription} = this.state;
        const comment = {
            'blog': this.props.blogItem.url,
            'description': commentDescription
        };
        this.props.addComment(comment);
        this.setState({
            description: "",
        });

    };

    render() {
        if (this.state.redirect) {
            return <Redirect to='/'/>
        }
        if (this.props.blogItem) {
            const authLinks = (
                <div>
                    <UpdateForm name="Update Blog" title={this.props.blogItem.title} id={this.props.blogItem.id}
                                description={this.props.blogItem.description}/>
                    <button className="btn btn-danger btn-sm"
                            onClick={this.onClick}> Delete
                    </button>
                </div>
            );
            const commentField = (
                <form onSubmit={this.postComment}>
                        <input
                            className="form-control"
                            type="text"
                            value={this.state.commentDescription}
                            name="commentDescription"
                            placeholder="Add a Comment"
                            onChange={this.onChange}
                            required
                        />
                    </form>
            );

            let isOwner = false;
            let isAuthenticated;
            const owner = this.props.blogItem.owner;
            if (this.props.auth.isAuthenticated) {
                isOwner = this.props.auth.user.username === owner;
                isAuthenticated = this.props.auth.isAuthenticated;

            }

            return (
                <Fragment>
                    <div>
                        <div className="card" key={this.props.blogItem.id}>
                            <div className="card-body" key={this.props.blogItem.id}>
                                <p className="card-text">Posted by: {this.props.blogItem.owner}</p>
                                <h5 className="card-title">Title: {this.props.blogItem.title}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{this.props.blogItem.description}</h6>
                                <p className="card-text">{(new Date(this.props.blogItem.created)).toString()}</p>

                                {isAuthenticated? commentField: null}

                                {isOwner ? authLinks : null}
                            </div>
                        </div>


                        {this.props.blogItem.comment.map((comment) => (
                            <div className="card" key={comment.id}>
                                <div className="card-body" key={comment.id}>
                                    <h5 className="card-title">{comment.description}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">By: {comment.owner}</h6>
                                    <p className="card-text">{(new Date(comment.created)).toString()}</p>
                                </div>
                            </div>
                        ))
                        }

                    </div>
                </Fragment>

            );
        } else
            return (
                <div className="card">
                    Something Went Wrong!
                </div>
            )
    }
}

const mapStateToProps = state => ({
    blogItem: state.blogItem.blogItem,
    auth: state.auth
});

export default connect(
    mapStateToProps, {getBlogItem, deleteBlog, addComment}
)(BlogItem);
