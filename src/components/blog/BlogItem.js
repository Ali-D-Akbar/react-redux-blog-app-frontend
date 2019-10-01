import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {blogDownvote, blogUpvote, deleteBlog, getBlogItem} from "../../actions/blogList";
import UpdateForm from "./UpdateForm";
import {addComment, deleteComment} from "../../actions/comment";
import CreateBlogModal from "../modal/CreateBlogModal";
import './BlogItem.css';
import defaultImage from '../../../public/default.png'

class BlogItem extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        messages: PropTypes.object.isRequired,
        deleteBlog: PropTypes.func.isRequired,
        getBlogItem: PropTypes.func.isRequired,
        addComment: PropTypes.func.isRequired,
        deleteComment: PropTypes.func.isRequired,
        blogUpvote: PropTypes.func.isRequired,
        blogDownvote: PropTypes.func.isRequired,
    };

    state = {
        commentDescription: "",
        replyDescription: "",
        reload: false,
        modalShow: false
    };

    showModal = () => {
        this.setState({modalShow: true});
    };

    hideModal = () => {
        this.setState({modalShow: false});
    };

    componentDidMount() {
        const {match: {params}} = this.props;
        this.props.getBlogItem(params.blogId);
    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };

    deleteComment = commentId => e => {
        this.props.deleteComment(commentId);
        setTimeout(() => this.setState({reload: true}), 1000);
    };

    deleteBlog = e => {
        this.props.deleteBlog(this.props.blogItem.id);
        setTimeout(() => this.setState({reload: true}), 1000);
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
            commentDescription: "",
        });
        setTimeout(() => this.setState({reload: true}), 1000);
    };

    postReply = parentId => e => {
        e.preventDefault();
        const {replyDescription} = this.state;
        const reply = {
            'parent': parentId,
            'blog': this.props.blogItem.url,
            'description': replyDescription
        };
        this.props.addComment(reply);
        this.setState({
            replyDescription: "",
        });
        setTimeout(() => this.setState({reload: true}), 1000);
    };

    upvote = id => e => {
        this.props.blogUpvote(id);
        setTimeout(() => this.setState({reload: true}), 1000);
    };

    downvote = id => e => {
        this.props.blogDownvote(id);
        setTimeout(() => this.setState({reload: true}), 1000);
    };

    render() {
        if (this.state.reload) {
            window.location.reload();
        }
        if (this.props.blogItem) {
            const authLinks = (
                <div>
                    <UpdateForm name="Update Blog" title={this.props.blogItem.title} id={this.props.blogItem.id}
                                description={this.props.blogItem.description}/>
                </div>
            );
            let isOwner = false;
            let isAuthenticated = false;
            const owner = this.props.blogItem.owner;
            if (this.props.auth.isAuthenticated) {
                isOwner = this.props.auth.user.username === owner;
                isAuthenticated = this.props.auth.isAuthenticated;
            }

            return (
                <Fragment>
                    <div className="col-lg-8">
                        <div className="mt-4 row">
                            <div className="col-sm-1">
                                <i className="arrow up" onClick={this.upvote(this.props.blogItem.id)} title="Vote Up"/>
                                <div className="count">{this.props.blogItem.votes}</div>
                                <i className="arrow down" onClick={this.downvote(this.props.blogItem.id)}
                                   title="Vote Down"/>
                            </div>

                            <div className="col-sm-7">
                                <h1>{this.props.blogItem.title}</h1>
                                <p className="lead">
                                    Posted by: {this.props.blogItem.owner}
                                </p>
                                Posted on: {(new Date(this.props.blogItem.created)).toDateString()}
                            </div>

                            <div className="col-sm-4">
                                {isAuthenticated && this.props.auth.user.username === this.props.blogItem.owner ?
                                    <div className="container">
                                        <button className="float-right btn btn-primary col-sm-6" type="button"
                                                onClick={this.showModal}>
                                            Edit
                                        </button>

                                        <button className="float-right btn btn-danger col-sm-6"
                                                onClick={this.deleteBlog}> Delete
                                        </button>
                                    </div>
                                    : null
                                }
                            </div>
                        </div>

                        {this.props.messages.vote ?
                            <p className='mt-4 alert-danger'>{this.props.messages.vote}</p>
                            : null}
                        {this.props.blogItem.image ?
                            <img className="mt-4 img-fluid rounded"
                                 src={this.props.blogItem.image}
                                 alt=""
                            />
                            :
                            <img className="mt-4 img-fluid rounded"
                                 src={defaultImage}
                                 alt=""
                            />
                        }

                        <br/><br/><br/>

                        <p className="lead" align="justify">{this.props.blogItem.description}</p>
                        {isAuthenticated ?
                            <div className="card my-4">
                                <h5 className="card-header">Leave a Comment:</h5>
                                <div className="card-body">
                                    <form onSubmit={this.postComment}>
                                        <div className="form-group">
                                        <textarea
                                            className="form-control"
                                            name="commentDescription"
                                            value={this.state.commentDescription}
                                            onChange={this.onChange}
                                            rows="3"
                                            required
                                        />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Submit
                                        </button>
                                    </form>
                                </div>
                            </div>
                            : null
                        }

                        <div className="card bg-lightgray">
                            <div className="card-body">
                                <h4 className="card-title">Comments: </h4>
                                {this.props.blogItem.comment.map((comment) => {
                                    if (comment.parent == null) return (
                                        <div className="card bg-lightgray" key={comment.id}>
                                            <div className="card-body" key={comment.id}>
                                                <p className="card-text">Commented By: {comment.owner}</p>
                                                {isAuthenticated && this.props.auth.user.username === comment.owner ?
                                                    <i className="float-right fas fa-trash"
                                                       onClick={this.deleteComment(comment.id)}
                                                       title="Delete"
                                                    />
                                                    : null
                                                }
                                                <h5 className="card-title">{comment.description}</h5>
                                                <h6 className="card-subtitle mb-2 text-muted">{(new Date(comment.created)).toDateString()}</h6>
                                                {isAuthenticated ?
                                                    <div className="card my-4">
                                                        <h5 className="card-header">Reply:</h5>
                                                        <div className="card-body">
                                                            <form onSubmit={this.postReply(comment.id)}>
                                                                <div className="form-group">
                                                                    <textarea
                                                                        className="form-control"
                                                                        name="replyDescription"
                                                                        value={this.state.replyDescription}
                                                                        onChange={this.onChange}
                                                                        rows="3"
                                                                        required
                                                                    />
                                                                </div>
                                                                <button type="submit"
                                                                        className="btn btn-primary">Submit
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                    : null
                                                }

                                                <div className="card">
                                                    {comment.reply.map((reply) => (
                                                        <div className="card" key={comment.id}>
                                                            <div className="card-body" key={reply.id}>
                                                                <p className="card-text">Commented By: {reply.owner}</p>
                                                                {isAuthenticated && this.props.auth.user.username === reply.owner ?
                                                                    <i className="float-right fas fa-trash"
                                                                       onClick={this.deleteComment(reply.id)}
                                                                       title="Delete"
                                                                    />
                                                                    : null
                                                                }
                                                                <h5 className="card-title">{reply.description}</h5>
                                                                <h6 className="card-subtitle mb-2 text-muted">{(new Date(reply.created)).toDateString()}</h6>
                                                            </div>
                                                        </div>
                                                    ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                                }
                                <CreateBlogModal show={this.state.modalShow} handleClose={this.hideModal}
                                                 title="Edit">
                                    {isOwner ? authLinks : null}
                                </CreateBlogModal>
                            </div>
                        </div>

                    </div>
                </Fragment>

            );
        } else
            return (
                <div className="card">
                    No Blog Found
                </div>
            )
    }
}

const mapStateToProps = state => ({
    blogItem: state.blogItem.blogItem,
    auth: state.auth,
    messages: state.messages,
    errors: state.errors,
});

export default connect(
    mapStateToProps, {getBlogItem, deleteBlog, addComment, deleteComment, blogUpvote, blogDownvote}
)(BlogItem);
