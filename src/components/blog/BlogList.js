import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import defaultImage from '../../../public/default.png'
import {deleteBlog, getBlogItem, getBlogList, searchBlogs} from "../../actions/blogList";
import serverData from '../../config';
import './BlogList.css';

class BlogList extends Component {
    static propTypes = {
        blogList: PropTypes.object.isRequired,
        getBlogList: PropTypes.func.isRequired,
        searchBlogs: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
    };

    state = {
        keyword: "",
        type: "title",
        currentPage: 1,
        blogsPerPage: serverData.page_size,
        showDrafts: false,
        blogId: null,
        redirect: false,
    };

    onChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };

    search = e => {
        e.preventDefault();
        this.props.getBlogList(`/api/blog/?keyword=${this.state.keyword}`);
    };

    componentDidMount() {
        setTimeout(() => this.props.getBlogList('/api/blog/'), 1000);
    }


    nextPage = (event) => {
        const {currentPage, blogsPerPage} = this.state;
        if (this.state.currentPage + 1 <= Math.ceil(this.props.blogList.count / blogsPerPage)) {
            this.props.getBlogList(`/api/blog/?page=${this.state.currentPage + 1}`);
            this.setState({
                currentPage: currentPage + 1
            });
        }
    };

    previousPage = (event) => {
        const {currentPage} = this.state;
        if (this.state.currentPage - 1 > 0) {
            this.props.getBlogList(`/api/blog/?page=${this.state.currentPage - 1}`);
            this.setState({
                currentPage: currentPage - 1
            });
        }
    };

    handleClick = (event) => {
        this.props.getBlogList(`/api/blog/?page=${Number(event.target.id)}`);
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

        const {blogsPerPage} = this.state;

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(this.props.blogList.count / blogsPerPage); i++) {
            pageNumbers.push(i);
        }

        return (
            <div>
                {this.props.messages.login ?
                    <h4 className="rounded p-2 mt-4 alert-success">{this.props.messages.login}</h4>
                    :
                    null
                }
                <form className="my-3 search" onSubmit={this.search}>

                    <div className="row">
                        <div className="col-2">
                            <select className="rounded form-control"
                                    onChange={(e) => this.props.getBlogList('/api/blog/', e.target.value)}>
                                <option value="newest">Newest</option>
                                <option value="ascending">A-Z</option>
                                <option value="descending">Z-A</option>
                            </select>
                        </div>
                        <div className="col-3"/>
                        <div className="col-6">
                            <input
                                className="rounded form-control"
                                type="text"
                                value={this.state.keyword}
                                name="keyword"
                                placeholder="Find Blog Posts"
                                onChange={this.onChange}
                            />
                        </div>
                        <button className="rounded btn btn-primary" type="submit" title="Search">
                            <i className="fa fa-search"/>
                        </button>

                    </div>
                </form>

                <h1>Blog Posts</h1>

                {this.props.blogList.count === 0 ?
                    <div>
                        {this.props.blogList.loading ?
                            <h4>Loading...</h4>
                            :
                            <h4>No Posts Found!</h4>
                        }
                    </div>

                    :
                    <div>
                        {this.props.blogList.results.map((blogItem) => (
                            <div>
                                <Link to={`/blogitem/${blogItem.slug}`}
                                      style={{textDecoration: 'none', color: 'black'}}>
                                    <div className="m-4 rounded card card-body clickable"
                                         onClick={this.showBlogItem(blogItem.slug)}>

                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="post-thumbnail">

                                                    {blogItem.image ?
                                                        <img className="card-img-top"
                                                             height="250"
                                                             src={blogItem.image}
                                                             alt={blogItem.title}
                                                        />
                                                        :
                                                        <img className="card-img-top"
                                                             height="250"
                                                             src={defaultImage}
                                                             alt={blogItem.title}
                                                        />
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-7">
                                                <header className="entry-header">
                                                    <h3 className="entry-title">{blogItem.title}</h3>
                                                    <ul className="entry-meta list-inline">
                                                        <li> Posted by
                                                            <span className="posted-by">
                                                                <span className="author">
                                                                    {' ' + blogItem.owner.first_name + ' ' + blogItem.owner.last_name}
                                                                </span>
                                                            </span>
                                                        </li>
                                                        <li>Posted on
                                                            <span className="posted-on">
                                                                <time className="updated">
                                                                    {' ' + (new Date(blogItem.created)).toDateString()}
                                                                </time>
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </header>
                                                <div className="card-text">
                                                    {blogItem.description.length > 200 ? `${blogItem.description.substring(0, 400)}...` : blogItem.description}
                                                </div>
                                                {blogItem.draft ?
                                                    <button className="rounded btn btn-primary float-right bottom"
                                                            onClick={this.showBlogItem(blogItem.id)}>Show Draft
                                                    </button>
                                                    :
                                                    <button className="rounded btn btn-primary float-right bottom"
                                                            onClick={this.showBlogItem(blogItem.id)}>Read More
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                            </div>
                        ))}

                        <div className="ml-2 container row">
                            <a className="page-numbers previous rounded col-sm1"
                               onClick={this.previousPage}> <i className="fa fa-angle-left"/> Previous</a>
                            <div className="col-sm text-center">
                                {
                                    pageNumbers.map(number => {
                                        if (number === this.state.currentPage) {
                                            return (
                                                <a className="rounded current page-numbers"
                                                   key={number}
                                                   id={number}
                                                   onClick={this.handleClick}>

                                                    {number}
                                                </a>
                                            );
                                        }
                                        return (
                                            <a className="rounded page-numbers"
                                               key={number}
                                               id={number}
                                               onClick={this.handleClick}>
                                                {number}
                                            </a>
                                        );
                                    })
                                }
                            </div>

                            <a className="page-numbers mr-3 rounded next float-right col-sm1"
                               onClick={this.nextPage}>
                                Next <i className="fa fa-angle-right"/>
                            </a>
                        </div>
                    </div>
                }
            </div>

        );
    }
}

const mapStateToProps = state => ({
    blogList: state.blogList,
    messages: state.messages,
    auth: state.auth,
});

export default connect(mapStateToProps, {getBlogList, deleteBlog, getBlogItem, searchBlogs})(BlogList);
