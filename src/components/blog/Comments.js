import React, {Component} from 'react';
import {connect} from 'react-redux';
import './BlogList.css'
import {getComments} from "../../actions/comment";
import PropTypes from "prop-types";

class Comments extends Component {
    static propTypes = {
        comments: PropTypes.array.isRequired,
        getComments: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.getComments();
    }

    render() {
        if (this.props.comments) {
            return (
                <div>
                    {this.props.comments.map((comment) => (
                        <div className="card" key={comment.id}>
                            <div className="card-body clickable" key={comment.id}>
                                <h6 className="card-subtitle mb-2 text-muted">{comment.description}</h6>
                                <h5 className="card-title">By: {comment.owner}</h5>
                                <p className="card-text">{(new Date(comment.created)).toString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <div>

                </div>
            )
        }
    }
}

const mapStateToProps = state => ({
    comments: state.comments.comments
});

export default connect(mapStateToProps, {getComments})(Comments);
