import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import styles from '../css/register.module.css';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

class Register extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/profile");
        }
      }

    componentWillReceiveProps(nextProps){
        if (nextProps.errors){
            this.setState({
                errors: nextProps.errors
            });
        }
    };

    onChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    onSubmit = e => {
        e.preventDefault();

        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };

        console.log("Adding new user: " + newUser);
        this.props.registerUser(newUser, this.props.history);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className={styles.registerForm}>
                        <h1 className="text-center mb-4">Register</h1>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input onChange={this.onChange}
                                    value={this.state.name}
                                    error={this.state.errors.name}
                                    id="name"
                                    type="text"
                                    placeholder="Enter a username"
                                    className="form-control"
                                />
                                <span className={styles.redtext}>
                                    {this.state.errors.name}
                                </span>
                            </div>
                            <div className="form-group">
                                <input onChange={this.onChange}
                                    value={this.state.email}
                                    error={this.state.errors.email}
                                    id="email"
                                    type="email"
                                    placeholder="Enter an email address"
                                    className="form-control"
                                />
                                <span className={styles.redtext}>
                                    {this.state.errors.email}
                                </span>
                            </div>
                            <div className="form-group">
                                <input onChange={this.onChange}
                                    value={this.state.password}
                                    error={this.state.errors.password}
                                    id="password"
                                    type="password"
                                    placeholder="Enter a password"
                                    className="form-control"
                                />
                                <span className={styles.redtext}>
                                    {this.state.errors.password}
                                </span>
                            </div>
                            <div className="form-group">
                                <input onChange={this.onChange}
                                    value={this.state.password2}
                                    error={this.state.errors.password2}
                                    id="password2"
                                    type="password"
                                    placeholder="Confirm password"
                                    className="form-control"
                                />
                                <span className={styles.redtext}>
                                    {this.state.errors.password2}
                                </span>
                            <div className="form-group">
                                <button className="btn btn-primary w-100 form-control mt-3"
                                        type="submit"
                                >
                                    Register
                                </button>
                            </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { registerUser }
)(withRouter(Register));