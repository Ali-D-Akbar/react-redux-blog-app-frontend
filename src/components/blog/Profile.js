import {getData, getName} from 'country-list';
import PropTypes from "prop-types";
import React, {Component, Fragment} from "react";
import {connect} from 'react-redux';
import defaultProfilePicture from '../../../public/facebook-anonymous-app.jpg'
import {updateProfile, updateUser} from "../../actions/auth";
import './Profile.css';


class Profile extends Component {

    static propTypes = {
        auth: PropTypes.object.isRequired,
    };

    state = {
        modalShow: false,
        first_name: "",
        last_name: "",
        email: "",
        gender: "",
        country: "",
        date_of_birth: "",
        contact_number: "",
        image: "",
    };

    componentDidMount() {
        setTimeout(() => {
            if (this.props.auth.user)
                this.setState({
                    modalShow: false,
                    first_name: this.props.auth.user.first_name,
                    last_name: this.props.auth.user.last_name,
                    email: this.props.auth.user.email,
                    gender: this.props.auth.user.profile.gender,
                    country: this.props.auth.user.profile.country,
                    date_of_birth: this.props.auth.user.profile.date_of_birth,
                    contact_number: this.props.auth.user.profile.contact_number,
                    image: "",
                })
        }, 1000)
    }

    onChange = e => {
        if (e.target.name === 'contact_number' && (e.target.value.match(/^[+0-9]+$/) || e.target.value === ''))
            this.setState({[e.target.name]: e.target.value});
        else if ((e.target.name === 'first_name' || e.target.name === 'last_name') &&
            (e.target.value.match(/^[A-Za-z]+$/) || e.target.value === ''))
            this.setState({[e.target.name]: e.target.value});
        else if (e.target.name !== 'contact_number' && e.target.name !== 'first_name' && e.target.name !== 'last_name')
            this.setState({[e.target.name]: e.target.value});
    };

    handleImageChange = (e) => {
        this.setState({
            image: e.target.files[0]
        })
    };

    showModal = () => {
        this.setState({modalShow: true});
    };

    hideModal = () => {
        this.setState({modalShow: false});
    };

    showDiv = (e) => {
        let input = this.refs[e.target.id];
        e.target.style.display = "none";
        input.style.display = "block";
        input.focus();
    };

    showImageDiv = (e) => {
        let img = this.refs["image"];
        img.style.display = "block";
        img.focus();
    };

    onBlur = (e) => {
        let body = new FormData();
        body.append(e.target.name, e.target.value);
        if (e.target.name === 'first_name' || e.target.name === 'last_name' || e.target.name === 'email')
            this.props.updateUser(this.props.auth.user.id, body);
        else {
            if (this.state.image) {
                body.append('image', this.state.image, this.state.image.name);
                this.props.updateProfile(this.props.auth.user.profile.id, body, true);
            } else {
                this.props.updateProfile(this.props.auth.user.profile.id, body);
            }

        }
        let input = this.refs[e.target.id];
        input.style.display = "block";

        e.target.style = {display: "none"}
    };

    render() {
        const {isAuthenticated, user} = this.props.auth;

        let countries = getData();
        countries.sort(function (a, b) {
            a = a.name.toLowerCase();
            b = b.name.toLowerCase();

            return (a < b) ? -1 : (a > b) ? 1 : 0;
        });

        if (isAuthenticated) {
            return (
                <Fragment>
                    <div className="mt-3 container card card-body">
                        <div className="row">
                            <div className="col-sm-4">
                                <img
                                    src={user.profile && user.profile.image ? user.profile.image : defaultProfilePicture}
                                    alt=""
                                    className="img-thumbnail"
                                    id="edit"
                                />

                                <button onClick={this.showImageDiv} className="profile-edit rounded btn btn-primary">
                                    <i className="fa fa-pencil"/>
                                </button>

                                <form className="profile-input" ref="image" onSubmit={this.onBlur}>
                                    <input
                                        className="btn"
                                        type="file"
                                        name="image"
                                        onChange={this.handleImageChange}
                                        accept="image/*"
                                    />
                                    <label>(Best Size: 500 x 500)</label>
                                    <button type="submit" className="float-right btn btn-primary rounded">
                                        Upload
                                    </button>
                                </form>
                            </div>
                            <div className="col-sm-8">
                                <p className="info text-info">
                                    (Click on any field to edit from your profile.)
                                </p>
                                <div className="card card-body">

                                    <h4 className="row">
                                        <label className="col-sm-4"> Username: </label>
                                        <div className="col-sm-8">
                                            <p>
                                                {user.username}
                                            </p>
                                        </div>
                                    </h4>

                                    <h4 className="row">
                                        <label className="col-sm-4"> First Name: </label>
                                        <div className="col-sm-8">
                                            <p onClick={this.showDiv} id="first_name" ref="first_name_label">
                                                {user.first_name ? ' ' + user.first_name : " ---"}
                                            </p>
                                            <input
                                                className="profile-input form-control"
                                                id="first_name_label"
                                                ref="first_name"
                                                type="text"
                                                pattern="[A-Za-z]+"
                                                name="first_name"
                                                onChange={this.onChange}
                                                onBlur={this.onBlur}
                                                placeholder="Enter First Name"
                                                title="Alphabets Only"
                                                value={this.state.first_name}
                                            />
                                        </div>
                                    </h4>

                                    <h4 className="row">
                                        <label className="col-sm-4"> Last Name: </label>
                                        <div className="col-sm-8">
                                            <p onClick={this.showDiv} id="last_name" ref="last_name_label">
                                                {user.last_name ? user.last_name : "---"}
                                            </p>
                                            <input
                                                className="profile-input form-control"
                                                id="last_name_label"
                                                ref="last_name"
                                                type="text"
                                                pattern="[A-Za-z]+"
                                                name="last_name"
                                                onChange={this.onChange}
                                                onBlur={this.onBlur}
                                                placeholder="Enter Last Name"
                                                title="Alphabets Only"
                                                value={this.state.last_name}
                                            />
                                        </div>

                                    </h4>

                                    {this.props.errors.msg.email ?
                                        <span className='alert alert-danger'>
                                            {this.props.errors.msg.email}
                                        </span>
                                        : null
                                    }

                                    <h4 className="row">
                                        <label className="col-sm-4"> E-mail: </label>
                                        <div className="col-sm-8">
                                            <p onClick={this.showDiv} id="email" ref="email_label">
                                                {user.email ? user.email : "---"}
                                            </p>

                                            <input
                                                className="profile-input form-control"
                                                id="email_label"
                                                ref="email"
                                                type="email"
                                                name="email"
                                                onChange={this.onChange}
                                                onBlur={this.onBlur}
                                                value={this.state.email}
                                                placeholder="Enter Last Name"
                                                required
                                                aria-required="true"
                                            />
                                        </div>
                                    </h4>

                                    <h4 className="row">
                                        <label className="col-sm-4"> Gender: </label>
                                        <div className="col-sm-8">
                                            <p onClick={this.showDiv} id="gender" ref="gender_label">
                                                {user.profile.gender === 'M' ? 'Male' : user.profile.gender === 'F' ? 'female' : '---'}
                                            </p>

                                            <select className="profile-input form-control"
                                                    id="gender_label"
                                                    ref="gender"
                                                    onBlur={this.onBlur}
                                                    name="gender"
                                                    value={this.state.gender}
                                                    onChange={(e) => this.setState({'gender': e.target.value})}>

                                                <option value="">Choose here</option>
                                                <option value="M">Male</option>
                                                <option value="F">Female</option>
                                            </select>
                                        </div>
                                    </h4>

                                    <h4 className="row">
                                        <label className="col-sm-4"> Country: </label>
                                        <div className="col-sm-8">
                                            <p onClick={this.showDiv} id="country" ref="country_label">
                                                {getName(user.profile.country)}
                                            </p>

                                            <select className="profile-input mb-2 rounded form-control"
                                                    id="country_label"
                                                    ref="country"
                                                    onBlur={this.onBlur}
                                                    name="country"
                                                    value={this.state.country}
                                                    onChange={(e) => this.setState({'country': e.target.value})}>

                                                {countries.map(country => (
                                                    <option value={country.code}>{country.name}</option>
                                                ))
                                                }
                                            </select>
                                        </div>
                                    </h4>

                                    <h4 className="row">
                                        <label className="col-sm-4"> Date of Birth: </label>
                                        <div className="col-sm-8">
                                            <p onClick={this.showDiv} id="date_of_birth" ref="date_of_birth_label">
                                                {user.profile.date_of_birth ?
                                                    new Date(user.profile.date_of_birth).toDateString()
                                                    :
                                                    '---'
                                                }
                                            </p>

                                            <input
                                                className="profile-input form-control"
                                                id="date_of_birth_label"
                                                type="date"
                                                ref="date_of_birth"
                                                name="date_of_birth"
                                                onChange={this.onChange}
                                                onBlur={this.onBlur}
                                                value={this.state.date_of_birth}
                                                max="2015-12-31"
                                            />
                                        </div>
                                    </h4>

                                    <h4 className="row">
                                        <label className="col-sm-4"> Contact: </label>
                                        <div className="col-sm-8">
                                            <p onClick={this.showDiv} id="contact_number" ref="contact_number_label">
                                                {user.profile.contact_number ? user.profile.contact_number : '---'}
                                            </p>

                                            <input
                                                className="profile-input form-control"
                                                id="contact_number_label"
                                                type="tel"
                                                pattern="[+0-9]+"
                                                ref="contact_number"
                                                name="contact_number"
                                                onChange={this.onChange}
                                                onBlur={this.onBlur}
                                                value={this.state.contact_number}
                                                placeholder="Contact Number"
                                                title="+ and Numbers Only"
                                            />
                                        </div>
                                    </h4>

                                    {this.props.messages && this.props.messages.profile ?
                                        <span className='alert alert-success'>
                                            {this.props.messages.profile}
                                        </span>
                                        : null
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        } else {
            return (
                <div>

                </div>
            )
        }

    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors,
    messages: state.messages,
});

export default connect(mapStateToProps, {updateProfile, updateUser})(Profile);
