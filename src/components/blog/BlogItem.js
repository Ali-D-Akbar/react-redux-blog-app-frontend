import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {deleteBlog, getBlogItem} from "../../actions/blogList";
import UpdateForm from "./UpdateForm";
import {Redirect} from "react-router-dom";


class BlogItem extends Component {
    static propTypes = {
        blogItem: PropTypes.object.isRequired,
        auth: PropTypes.object.isRequired,
        deleteBlog: PropTypes.func.isRequired,
        getBlogItem: PropTypes.func.isRequired,
    };

    state = {
        redirect: false
    };

    componentDidMount() {
        const {id} = this.props.location.props;
        this.props.getBlogItem(id);
    }

    onClick = e => {
        this.props.deleteBlog(this.props.blogItem.id);
        this.setState({
            redirect: true
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

            const isOwner = this.props.auth.user.username === this.props.blogItem.owner;


            return (
                <Fragment>
                    <div>
                        <div className="card" key={this.props.blogItem.id}>
                            <div className="card-body" key={this.props.blogItem.id}>
                                <p className="card-text">Posted by: {this.props.blogItem.owner}</p>
                                <h5 className="card-title">Title: {this.props.blogItem.title}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{this.props.blogItem.description}</h6>
                                <p className="card-text">{(new Date(this.props.blogItem.created)).toString()}</p>

                                {isOwner ? authLinks : null}
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
    mapStateToProps, {getBlogItem, deleteBlog}
)(BlogItem);
