import React from "react";
import './Modal.css';

const CreateBlogModal = ({handleClose, show, children}) => {
    const showHideClassName = show ? "card modal display-block" : "modal display-none";

    return (
        <div className={showHideClassName}>
                <section className="card-body modal-main">
                    {children}
                    <button className="nav-link btn btn-info btn-sm text-light" onClick={handleClose}>close</button>
                </section>
        </div>
    );
};

export default CreateBlogModal;