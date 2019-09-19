import React, {Fragment} from "react";
import Form from "./Form";
import BlogList from "./BlogList";

export default function Dashboard() {
    return (
        <Fragment>
            <Form/>
            <BlogList/>
        </Fragment>
    );
}