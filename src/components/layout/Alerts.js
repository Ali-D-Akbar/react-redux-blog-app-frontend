import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

class Alerts extends Component {
    static propTypes = {
        error: PropTypes.object.isRequired,
        message: PropTypes.object.isRequired
    };

    componentDidUpdate(prevProps) {
        const {error, alert, message} = this.props;
        if (error !== prevProps.error) {
            if (error.msg.description) alert(`Description: ${error.msg.name.join()}`);
            if (error.msg.title) alert(`Title: ${error.msg.email.join()}`);
            if (error.msg.non_field_errors)
                alert(error.msg.non_field_errors.join());
            if (error.msg.username) alert(error.msg.username.join());
        }

        if (message !== prevProps.message) {
            if (message.deleteBlog) alert(message.deleteBlog);
            if (message.addBlog) alert(message.addBlog);
            if (message.passwordNotMatch) alert(message.passwordNotMatch);
        }
    }

    render() {
        return <Fragment/>;
    }
}

const mapStateToProps = state => ({
    error: state.errors,
    message: state.messages
});

export default connect(mapStateToProps)(Alerts);
