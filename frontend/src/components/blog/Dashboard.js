import React, {Fragment} from "react";
import CreateForm from "./CreateForm";
import BlogList from "./BlogList";

export default function Dashboard() {
    return (
        <Fragment>
            <CreateForm/>
            <BlogList/>
        </Fragment>
    );
}

