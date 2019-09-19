import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {deleteBlog, getBlogItem, getBlogList} from "../../actions/blogList";
import './BlogList.css'
import {Link} from "react-router-dom";

class BlogList extends Component {

    static propTypes = {
        blogList: PropTypes.array.isRequired,
        getBlogList: PropTypes.func.isRequired,
        deleteBlog: PropTypes.func.isRequired
    };

    state = {
        currentPage: 1,
        blogsPerPage: 3
    };

    componentDidMount() {
        this.props.getBlogList();
    }

    handleClick = (event) => {
        this.setState({
            currentPage: Number(event.target.id)
        });
    };

    render() {
        const {currentPage, blogsPerPage} = this.state;

        const indexOfLastTodo = currentPage * blogsPerPage;
        const indexOfFirstTodo = indexOfLastTodo - blogsPerPage;
        const currentBlogList = this.props.blogList.slice(indexOfFirstTodo, indexOfLastTodo);

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(this.props.blogList.length / blogsPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    key={number}
                    id={number}
                    onClick={this.handleClick}
                >
                    {number}
                </li>
            );
        });

        return (
            <div>
                <h1>Blog List</h1>
                {currentBlogList.map((blogItem) => (
                    <div className="card" key={blogItem.id}>
                        <Link to={{
                            pathname: '/blogitem',
                            props: {
                                id: blogItem.id
                            }
                        }} className="nav-link">
                            <div className="card-body clickable" key={blogItem.id}>
                                <p className="card-text">Posted by: {blogItem.owner}</p>
                                <h5 className="card-title">Title: {blogItem.title}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{blogItem.description}</h6>
                                <p className="card-text">{(new Date(blogItem.created)).toString()}</p>
                                <button className="btn btn-danger btn-sm"
                                        onClick={this.props.deleteBlog.bind(this, blogItem.id)}> Delete
                                </button>
                            </div>
                        </Link>
                    </div>
                ))}

                <ul id="page-numbers">
                    Page: <br/>
                    {renderPageNumbers}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    blogList: state.blogList.blogList
});

export default connect(mapStateToProps, {getBlogList, deleteBlog, getBlogItem})(BlogList);