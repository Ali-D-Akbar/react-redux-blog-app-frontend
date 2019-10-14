import PropTypes from "prop-types";
import React, {Component} from "react";
import {connect} from "react-redux";
import {getData, getCode} from "country-list";

class EditProfile extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
    };

    state = {
        first_name: this.props.user.first_name,
        last_name: this.props.user.last_name,
        email: this.props.user.email,
        gender: this.props.user.profile.gender,
        country: this.props.user.profile.country,
        date_of_birth: this.props.user.profile.date_of_birth,
        contact_number: this.props.user.profile.contact_number,
        image: "",
    };

    onChange = e => this.setState({[e.target.name]: e.target.value});

    handleImageChange = (e) => {
        this.setState({
            image: e.target.files[0]
        })
    };

    onSubmit = e => {
        e.preventDefault();
        let form_data = new FormData();
        if (this.state.image) {
            form_data.append('image', this.state.image, this.state.image.name);
            // this.props.updateBlog(this.state.id, form_data, true);
        } else {
            // this.props.updateBlog(this.state.id, form_data, false);
        }

        console.log(this.state);

    };

    render() {

        let countries = getData();
        countries.sort(function (a, b) {
                    a = a.name.toLowerCase();
                    b = b.name.toLowerCase();

                    return (a < b) ? -1 : (a > b) ? 1 : 0;
                });

        return (
            <div className="card card-body mt-4 mb-4">
                <form onSubmit={this.onSubmit}>

                    <div className="form-group">
                        <p id="formInstructions" className="mt-3">Fields marked with an asterisk (*) are required.</p>
                        <label>First Name</label>
                        <input
                            className="form-control"
                            type="text"
                            pattern="[A-Za-z]+"
                            name="first_name"
                            onChange={this.onChange}
                            title="Alphabets Only"
                            value={this.state.first_name}
                        />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            className="form-control"
                            type="text"
                            pattern="[A-Za-z]+"
                            name="last_name"
                            onChange={this.onChange}
                            title="Alphabets Only"
                            value={this.state.last_name}
                        />
                    </div>

                    <div className="form-group">
                        <label>E-mail *</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            onChange={this.onChange}
                            value={this.state.email}
                            required
                            aria-required="true"
                        />
                    </div>

                    <div className="form-group">
                        <label>Gender</label>
                        <select className="rounded form-control"
                                name="gender"
                                value={this.state.gender}
                                onChange={(e) => this.setState({'gender': e.target.value})}>

                            <option value="">Choose here</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Country</label>
                        <select className="rounded form-control"
                                name="country"
                                value={this.state.country}
                                onChange={(e) => this.setState({country: e.target.value})}>

                            {/*<option value="" selected disabled hidden>Choose here</option>*/}
                            {countries.map(country => (
                                <option value={country.code}>{country.name}</option>
                            ))
                            }
                        </select>

                    </div>

                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            className="form-control"
                            name="date_of_birth"
                            onChange={this.onChange}
                            value={this.state.date_of_birth}
                        />
                    </div>

                    <div className="form-group">
                        <label>Contact Number</label>
                        <input
                            type="tel"
                            className="form-control"
                            pattern="[+0-9]+"
                            name="contact_number"
                            onChange={this.onChange}
                            value={this.state.contact_number}
                            title="+ and Numbers Only"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            className="btn"
                            type="file"
                            name="image"
                            onChange={this.handleImageChange}
                            accept="image/*"
                        />
                        <label>(Best Size: 380 x 500)</label>
                    </div>

                    <div className="form-group">
                        <button type="submit" className="mr-4 rounded btn btn-primary">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.auth.user,
});

export default connect(
    mapStateToProps,
    {}
)(EditProfile);
