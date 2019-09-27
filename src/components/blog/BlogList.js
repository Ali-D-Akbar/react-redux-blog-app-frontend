import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {deleteBlog, getBlogItem, getBlogList, searchBlogs} from "../../actions/blogList";
import './BlogList.css'
import {Link} from "react-router-dom";

class BlogList extends Component {

    static propTypes = {
        blogList: PropTypes.array.isRequired,
        getBlogList: PropTypes.func.isRequired,
        searchBlogs: PropTypes.func.isRequired
    };

    state = {
        keyword: "",
        type: "title",
        currentPage: 1,
        blogsPerPage: 5
    };

    onChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };

    search = e => {
        e.preventDefault();
        this.props.searchBlogs(`?keyword=${this.state.keyword}`);
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
                <form className="form-inline" onSubmit={this.search}>
                    <input
                        className="form-control col-sm-10"
                        type="text"
                        value={this.state.keyword}
                        name="keyword"
                        placeholder="Search"
                        onChange={this.onChange}
                        required
                    />
                    <input
                        className="btn btn-primary col-sm-2"
                        type="submit"
                    />

                </form>

                <h1>Blog List</h1>

                <ul id="page-numbers">
                    Page: <br/>
                    {renderPageNumbers}
                </ul>

                {currentBlogList.map((blogItem) => (
                    <div className="card" key={blogItem.id}>
                        <Link to={{
                            pathname: `/blogitem/${blogItem.id}`,
                        }} className="nav-link">
                            <div className="card-body clickable" key={blogItem.id}>
                                <h5 className="card-title">Title: {blogItem.title}</h5>
                                <h6 className="card-text">{blogItem.description}</h6>

                                {blogItem.image ?
                                    <img className="card-img-top"
                                         src={blogItem.image}
                                         alt="new"
                                    />
                                    : null
                                }
                                <h6 className="card-text">Posted by: {blogItem.owner}</h6>
                                <p className="card-subtitle mb-2 text-muted">{(new Date(blogItem.created)).toString()}</p>
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
    blogList: state.blogList.blogList,
});

export default connect(mapStateToProps, {getBlogList, deleteBlog, getBlogItem, searchBlogs})(BlogList);
