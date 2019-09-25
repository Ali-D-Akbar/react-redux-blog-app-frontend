import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {deleteBlog, getBlogItem} from "../../actions/blogList";
import UpdateForm from "./UpdateForm";
import {Redirect} from "react-router-dom";
import {addComment} from "../../actions/comment";
import CreateBlogModal from "../modal/CreateBlogModal";


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
        replyDescription: "",
        redirect: false,
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

    onClick = e => {
        this.props.deleteBlog(this.props.blogItem.id);
        setTimeout(() => this.setState({redirect: true}), 1000);
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
        setTimeout(() => this.setState({redirect: true}), 1000);
    };

    postReply = parentId => e => {
        e.preventDefault();
        const {replyDescription} = this.state;
        const reply = {
            'parent': parentId,
            'blog': this.props.blogItem.url,
            'description': replyDescription
        };
        console.log(reply);
        this.props.addComment(reply);
        this.setState({
            replyDescription: "",
        });
        setTimeout(() => this.setState({redirect: true}), 1000);
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
                <div>
                    <button className="btn btn-primary" type="button" onClick={this.showModal}>
                        Edit
                    </button>

                    <form onSubmit={this.postComment}>
                        <textarea
                            className="form-control"
                            value={this.state.commentDescription}
                            name="commentDescription"
                            placeholder="Add a Comment"
                            onChange={this.onChange}
                            required
                        />
                        <button className="btn btn-primary" type="submit">
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
                                <h4 className="card-title">Comments: </h4>
                                {this.props.blogItem.comment.map((comment) => (
                                    <div className="card">
                                        <div className="card-body" key={comment.id}>
                                            <h5 className="card-title">{comment.description}</h5>
                                            <p className="card-text">By: {comment.owner}</p>
                                            <h6 className="card-subtitle mb-2 text-muted">{(new Date(comment.created)).toString()}</h6>
                                            <form onSubmit={this.postReply(comment.id)}>
                                                <textarea
                                                    className="form-control"
                                                    value={this.state.replyDescription}
                                                    name="replyDescription"
                                                    placeholder="Add a Reply"
                                                    onChange={this.onChange}
                                                    required
                                                />
                                                <button className="btn btn-primary" type="submit">
                                                    Post
                                                </button>
                                            </form>
                                            {comment.reply.map((reply) => (
                                                <div className="card">
                                                    <div className="card-body" key={reply.id}>
                                                        <h5 className="card-title">{reply.description}</h5>
                                                        <p className="card-text">By: {reply.owner}</p>
                                                        <h6 className="card-subtitle mb-2 text-muted">{(new Date(reply.created)).toString()}</h6>
                                                    </div>
                                                </div>
                                            ))

                                            }
                                        </div>
                                    </div>

                                ))
                                }


                                <CreateBlogModal show={this.state.modalShow} handleClose={this.hideModal} title="Edit">
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
