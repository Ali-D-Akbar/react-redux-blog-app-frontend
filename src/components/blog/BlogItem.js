import PropTypes from "prop-types";
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Redirect} from "react-router-dom";
import defaultImage from '../../../public/default.png'
import defaultProfilePicture from "../../../public/facebook-anonymous-app.jpg";
import {blogDownvote, blogUpvote, deleteBlog, getBlogItem} from "../../actions/blogList";
import {addComment, deleteComment} from "../../actions/comment";
import CreateBlogModal from "../modal/CreateBlogModal";
import './BlogItem.css';
import UpdateForm from "./UpdateForm";

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
        reload: false,
        modalShow: false,
        deleteModal: false,
        deleteCommentModal: false,
    };

    showModal = () => {
        this.setState({modalShow: true});
    };

    hideModal = () => {
        this.setState({modalShow: false});
    };

    showDeleteModal = () => {
        this.setState({deleteModal: true});
    };

    hideDeleteModal = () => {
        this.setState({deleteModal: false});
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
        const {match: {params}} = this.props;
        setTimeout(() => this.props.getBlogItem(params.blogId), 1000);
    };

    deleteBlog = e => {
        this.props.deleteBlog(this.props.blogItem.slug);
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
        const {match: {params}} = this.props;
        setTimeout(() => this.props.getBlogItem(params.blogId), 1000);
    };

    postReply = parentId => e => {
        e.preventDefault();
        const replyDescription = e.target.elements.replyDescription.value;
        const reply = {
            'parent': parentId,
            'blog': this.props.blogItem.url,
            'description': replyDescription
        };
        this.props.addComment(reply);
        const {match: {params}} = this.props;
        setTimeout(() => this.props.getBlogItem(params.blogId), 1000);
        e.target.elements.replyDescription.value = "";
    };


    upvote = id => e => {
        this.props.blogUpvote(id);
        const {match: {params}} = this.props;
        setTimeout(() => this.props.getBlogItem(params.blogId), 1000);
    };

    downvote = id => e => {
        this.props.blogDownvote(id);
        const {match: {params}} = this.props;
        setTimeout(() => this.props.getBlogItem(params.blogId), 1000);
    };

    render() {
        if (this.state.reload) {
            return <Redirect to="/"/>;
        }
        if (this.props.blogItem) {
            const authLinks = (
                <div>
                    <UpdateForm name="Update Blog" title={this.props.blogItem.title} id={this.props.blogItem.slug}
                                description={this.props.blogItem.description} draft={this.props.blogItem.draft}/>
                </div>
            );
            let isOwner = false;
            let isAuthenticated = false;
            const owner = this.props.blogItem.owner.username;
            if (this.props.auth.isAuthenticated) {
                isOwner = this.props.auth.user.username === owner;
                isAuthenticated = this.props.auth.isAuthenticated;
            }

            return (
                <Fragment>
                    <div className="col-lg-8">
                        <div className="mt-4 row">
                            <div className="col-sm-1">
                                <i className="arrow up" onClick={this.upvote(this.props.blogItem.slug)}
                                   title="Vote Up"/>
                                <div className="count" title="Total Votes">{this.props.blogItem.votes.total_votes}</div>
                                <i className="arrow down" onClick={this.downvote(this.props.blogItem.slug)}
                                   title="Vote Down"/>
                            </div>

                            <div className="col-sm-7">
                                <div className="row">
                                    <img className="rounded-circle mr-2 ml-2" height="50"
                                         src={this.props.blogItem.owner.profile &&
                                         this.props.blogItem.owner.profile.image ?
                                             this.props.blogItem.owner.profile.image
                                             :
                                             defaultProfilePicture
                                         }
                                         alt="Profile Icon"
                                    />
                                    <div>
                                        <h4>
                                            {this.props.blogItem.owner.first_name + ' ' + this.props.blogItem.owner.last_name}
                                        </h4>
                                        <div
                                            className="text-muted">{(new Date(this.props.blogItem.created)).toDateString()} </div>
                                    </div>
                                </div>
                            </div>


                            <div className="col-sm-4">
                                {isAuthenticated && this.props.auth.user.username === this.props.blogItem.owner.username ?
                                    <div className="container">
                                        <button className="rounded btn btn-primary float-right ml-4"
                                                onClick={this.showModal} title="Edit">
                                            <i className="fa fa-pencil"/>
                                        </button>

                                        <button className="rounded btn btn-danger float-right"
                                                onClick={this.showDeleteModal} title="Delete">
                                            <i className="fa fa-trash"/>
                                        </button>
                                    </div>
                                    : null
                                }
                            </div>
                        </div>

                        {this.props.messages.vote ?
                            <p className='mt-4 alert-danger'>{this.props.messages.vote}</p>
                            : null
                        }

                        <h2 className="mt-4">{this.props.blogItem.title}</h2>

                        {this.props.blogItem.image ?
                            <img className="mt-4 img-fluid rounded"
                                 src={this.props.blogItem.image}
                                 alt={this.props.blogItem.title}
                            />
                            :
                            <img className="mt-4 img-fluid rounded"
                                 src={defaultImage}
                                 alt={this.props.blogItem.title}
                            />
                        }

                        <br/>

                        <div className="mt-4 lead">
                            {this.props.blogItem.description.split('\n').map(paragraph =>
                                <p align="justify">{paragraph}</p>
                            )}
                        </div>
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
                                            aria-required="true"
                                        />
                                        </div>
                                        <button type="submit" className="rounded btn btn-primary">
                                            Submit
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
                                                {isAuthenticated && this.props.auth.user.username === comment.owner.username ?
                                                    <button
                                                        className="rounded btn btn-danger float-right"
                                                        onClick={this.deleteComment(comment.id)}>
                                                        <i className="fa fa-trash" title="Delete"/>
                                                    </button>

                                                    : null
                                                }
                                                <div className="row">
                                                    <img className="rounded-circle mr-2 ml-2" height="50"
                                                         src={comment.owner.profile && comment.owner.profile.image ?
                                                             comment.owner.profile.image
                                                             :
                                                             defaultProfilePicture
                                                         }
                                                         alt="Profile Icon"
                                                    />
                                                    <div>
                                                        <h4>
                                                            {comment.owner.first_name + ' ' + comment.owner.last_name}
                                                        </h4>
                                                        <h6 className="card-subtitle mb-2 text-muted">
                                                            {(new Date(comment.created)).toDateString()}
                                                        </h6>
                                                    </div>
                                                </div>
                                                <h5 className="card-title mt-3">{comment.description}</h5>
                                                {isAuthenticated ?
                                                    <div className="card my-4">
                                                        <h5 className="card-header">Reply:</h5>
                                                        <div className="card-body">
                                                            <form onSubmit={this.postReply(comment.id)}>
                                                                <div className="form-group">
                                                                    <textarea
                                                                        className="form-control"
                                                                        name="replyDescription"
                                                                        rows="3"
                                                                        required
                                                                        aria-required="true"
                                                                    />
                                                                </div>
                                                                <button type="submit"
                                                                        className="rounded btn btn-primary">Submit
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
                                                                {isAuthenticated && this.props.auth.user.username === reply.owner.username ?
                                                                    <button
                                                                        className="rounded float-right btn btn-danger"
                                                                        onClick={this.deleteComment(reply.id)}>
                                                                        <i className="fa fa-trash" title="Delete"/>
                                                                    </button>
                                                                    : null
                                                                }
                                                                <div className="row">
                                                                    <img className="rounded-circle mr-2 ml-2"
                                                                         height="50"
                                                                         src={reply.owner.profile && reply.owner.profile.image ?
                                                                             reply.owner.profile.image
                                                                             :
                                                                             defaultProfilePicture
                                                                         }
                                                                         alt="Profile Icon"
                                                                    />
                                                                    <div>
                                                                        <h4>
                                                                            {reply.owner.first_name + ' ' + reply.owner.last_name}
                                                                        </h4>
                                                                        <h6 className="card-subtitle mb-2 text-muted">
                                                                            {(new Date(reply.created)).toDateString()}
                                                                        </h6>
                                                                    </div>

                                                                </div>

                                                                <h5 className="card-title mt-3">{reply.description}</h5>
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
                                <CreateBlogModal show={this.state.modalShow} handleClose={this.hideModal} title="Edit">
                                    {isOwner ? authLinks : null}
                                </CreateBlogModal>

                                <CreateBlogModal show={this.state.deleteModal} handleClose={this.hideDeleteModal}
                                                 title="Are You Sure you want to delete this?">
                                    <div>
                                        <form onSubmit={this.deleteBlog}>
                                            <div className="form-group">
                                                <button type="submit" className="rounded btn btn-primary">
                                                    Yes
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </CreateBlogModal>

                            </div>
                        </div>
                    </div>
                </Fragment>

            );
        } else
            return (
                <div>
                    {this.props.loading ?
                        <h4>Loading...</h4>
                        :
                        <h4>No blog post Found!</h4>
                    }
                </div>
            )
    }
}

const mapStateToProps = state => ({
    blogItem: state.blogItem.blogItem,
    loading: state.blogItem.loading,
    auth: state.auth,
    messages: state.messages,
    errors: state.errors,
});

export default connect(
    mapStateToProps, {getBlogItem, deleteBlog, addComment, deleteComment, blogUpvote, blogDownvote}
)(BlogItem);
