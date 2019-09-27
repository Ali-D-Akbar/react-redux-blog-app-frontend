import React, {Component, Fragment} from "react";
import BlogList from "./BlogList";
import CreateForm from "./CreateForm";
import CreateBlogModal from '../modal/CreateBlogModal'

class Dashboard extends Component {
    state = {
        modalShow: false,
    };

    showModal = () => {
        this.setState({modalShow: true});
    };

    hideModal = () => {
        this.setState({modalShow: false});
    };

    render() {
        return (
            <Fragment>
                <CreateBlogModal show={this.state.modalShow} handleClose={this.hideModal} title="Add New Blog">
                    <CreateForm/>
                </CreateBlogModal>
                <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                    <li className="nav-item">
                        <button className="btn btn-primary" type="button" onClick={this.showModal}>
                            Add New Blog
                        </button>
                    </li>
                </ul>
                <BlogList/>
            </Fragment>
        );
    }
}

export default Dashboard;
