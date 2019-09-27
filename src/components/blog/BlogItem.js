import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {blogDownvote, blogUpvote, deleteBlog, getBlogItem} from "../../actions/blogList";
import UpdateForm from "./UpdateForm";
import {addComment, deleteComment} from "../../actions/comment";
import CreateBlogModal from "../modal/CreateBlogModal";
import './BlogItem.css';

class BlogItem extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
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
                    <button className="btn btn-danger btn-sm"
                            onClick={this.deleteBlog}> Delete
                    </button>
                </div>
            );
            const commentField = (
                <div>
                    <form onSubmit={this.postComment}>
                        <textarea
                            className="form-control"
                            value={this.state.commentDescription}
                            name="commentDescription"
                            placeholder="Add a Comment"
                            onChange={this.onChange}
                            required
                        />
                        <button className="float-right btn btn-primary" type="submit">
                            Post
                        </button>
                    </form>
                </div>
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

                                <i className="arrow up" onClick={this.upvote(this.props.blogItem.id)}/>
                                <div className="count">{this.props.blogItem.votes}</div>
                                <i className="arrow down" onClick={this.downvote(this.props.blogItem.id)}/>

                                <button className="float-right btn btn-primary col-sm-2" type="button"
                                        onClick={this.showModal}>
                                    Edit
                                </button>

                                <h5 className="card-title">Title: {this.props.blogItem.title}</h5>
                                <h6 className="card-text">{this.props.blogItem.description}</h6>
                                {this.props.blogItem.image ?
                                    <img className="card-img-top"
                                         src={this.props.blogItem.image}
                                         alt="new"
                                    />
                                    : null
                                }
                                <h6 className="card-text">Posted by: {this.props.blogItem.owner}</h6>
                                <p className="card-subtitle mb-2 text-muted">{(new Date(this.props.blogItem.created)).toString()}</p>

                                {isAuthenticated ? commentField : null}

                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Comments: </h4>
                                        {this.props.blogItem.comment.map((comment) => {
                                            if (comment.parent == null) return (
                                                <div className="card" key={comment.id}>
                                                    <div className="card-body" key={comment.id}>
                                                        <h5 className="card-title">{comment.description}</h5>
                                                        <p className="card-text">By: {comment.owner}</p>
                                                        <h6 className="card-subtitle mb-2 text-muted">{(new Date(comment.created)).toString()}</h6>

                                                        {isAuthenticated && this.props.auth.user.username === comment.owner ?
                                                            <button className="btn btn-danger btn-sm"
                                                                    onClick={this.deleteComment(comment.id)}> Delete
                                                            </button>
                                                            : null
                                                        }

                                                        {isAuthenticated ?
                                                            <div>
                                                                <form onSubmit={this.postReply(comment.id)}>
                                                                <textarea
                                                                    className="form-control"
                                                                    value={this.state.replyDescription}
                                                                    name="replyDescription"
                                                                    placeholder="Add a Reply"
                                                                    onChange={this.onChange}
                                                                    required/>
                                                                    <button className="float-right btn btn-primary"
                                                                            type="submit">
                                                                        Post
                                                                    </button>
                                                                </form>
                                                            </div>
                                                            : null
                                                        }

                                                        <div className="card" key={comment.id}>
                                                            {comment.reply.map((reply) => (
                                                                <div className="card" key={comment.id}>
                                                                    <div className="card-body" key={reply.id}>
                                                                        <h5 className="card-title">{reply.description}</h5>
                                                                        <p className="card-text">By: {reply.owner}</p>
                                                                        <h6 className="card-subtitle mb-2 text-muted">{(new Date(reply.created)).toString()}</h6>
                                                                        {isAuthenticated && this.props.auth.user.username === reply.owner ?
                                                                            <button className="btn btn-danger btn-sm"
                                                                                    onClick={this.deleteComment(reply.id)}> Delete
                                                                            </button>
                                                                            : null
                                                                        }
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
    auth: state.auth
});

export default connect(
    mapStateToProps, {getBlogItem, deleteBlog, addComment, deleteComment, blogUpvote, blogDownvote}
)(BlogItem);
