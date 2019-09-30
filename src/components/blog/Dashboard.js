import React, {Component, Fragment} from "react";
import BlogList from "./BlogList";

class Dashboard extends Component {
    render() {
        return (
            <Fragment>
                <BlogList/>
            </Fragment>
        );
    }
}

export default Dashboard;
