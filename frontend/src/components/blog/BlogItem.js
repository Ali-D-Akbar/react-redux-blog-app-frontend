import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {getBlogItem} from "../../actions/blogList";
import UpdateForm from "./UpdateForm";


class BlogItem extends Component {
    static propTypes = {
        blogItem: PropTypes.object.isRequired,
        getBlogItem: PropTypes.func.isRequired
    };

    componentDidMount() {
        const {id} = this.props.location.props;
        this.props.getBlogItem(id);
    }

    render() {

        if (this.props.blogItem)
            return (
                <Fragment>
                    <div>
                        <div className="card" key={this.props.blogItem.id}>
                            <div className="card-body" key={this.props.blogItem.id}>
                                <p className="card-text">Posted by: {this.props.blogItem.owner}</p>
                                <h5 className="card-title">Title: {this.props.blogItem.title}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{this.props.blogItem.description}</h6>
                                <p className="card-text">{(new Date(this.props.blogItem.created)).toString()}</p>
                            </div>
                        </div>

                        <UpdateForm name="Update Blog" title={this.props.blogItem.title} id={this.props.blogItem.id}
                                    description={this.props.blogItem.description}/>
                    </div>
                </Fragment>

            );
        else
            return (
                <div className="card">
                    Something Went Wrong!
                </div>
            )
    }
}


const mapStateToProps = state => ({
    blogItem: state.blogItem.blogItem
});

export default connect(
    mapStateToProps, {getBlogItem}
)(BlogItem);
