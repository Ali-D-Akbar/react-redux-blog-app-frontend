import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import {deleteBlog, getBlogItem, getBlogList, searchBlogs} from "../../actions/blogList";
import './BlogList.css';
import defaultImage from '../../../public/default.png'
import ReactPaginate from 'react-paginate';

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
        blogsPerPage: 5,
        blogId: null,
        redirect: false,
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

    showBlogItem = id => e => {
        this.setState({
            blogId: id,
            redirect: true,
        })
    };

    render() {
        if (this.state.redirect)
            return <Redirect to={`/blogitem/${this.state.blogId}`}/>;

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
                <form className="my-3 search form-inline" onSubmit={this.search}>
                    <select className="form-control col-sm-2">
                        <option value="newest">Newest</option>
                        <option value="ascending">A-Z</option>
                        <option value="descending">Z-A</option>
                    </select>
                    <input
                        className="form-control col-sm-8"
                        type="text"
                        value={this.state.keyword}
                        name="keyword"
                        placeholder="Find Blog Posts"
                        onChange={this.onChange}
                        required
                    />
                    <button className="btn btn-primary col-sm-2" type="submit"><i className="fas fa-search"/></button>

                </form>

                <h1>Blog Posts</h1>

                {currentBlogList.map((blogItem) => (
                    <div className="m-4 card card-body clickable" onClick={this.showBlogItem(blogItem.id)}>

                        <div className="row">
                            <div className="col-md-5">
                                <div className="post-thumbnail">
                                    {blogItem.image ?
                                        <img className="card-img-top"
                                             height="300"
                                             src={blogItem.image}
                                             alt="new"
                                        />
                                        :
                                        <img className="card-img-top"
                                             height="300"
                                             src={defaultImage}
                                             alt="new"
                                        />
                                    }

                                </div>
                            </div>
                            <div className="col-md-7">
                                <header className="entry-header">
                                    <h3 className="entry-title">{blogItem.title}</h3>
                                    <ul className="entry-meta list-inline">
                                        <li>
                                            Posted by<span className="posted-by">
                                                    <span className="author"> {blogItem.owner}</span></span>
                                        </li>
                                        <li>
                                            Posted on
                                            <span className="posted-on">
                                                <time className="updated"
                                                      dateTime="2019-07-26T10:33:42+00:00"> {(new Date(blogItem.created)).toDateString()}
                                                </time>
                                            </span>
                                        </li>
                                    </ul>
                                </header>
                                <div className="card-text">
                                    {blogItem.description.length > 200 ? `${blogItem.description.substring(0, 400)}...` : blogItem.description}
                                </div>
                                <button className="btn btn-primary float-right bottom"
                                        onClick={this.showBlogItem(blogItem.id)}>Read More
                                </button>
                            </div>
                        </div>
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
